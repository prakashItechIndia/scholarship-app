import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
  AuthFlowType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';

import { EnvVars } from '../../config/env.validation';

export interface CognitoAuthResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CognitoUser {
  sub: string; // Cognito user ID
  email: string;
  emailVerified: boolean;
  status: string;
}

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  private client: CognitoIdentityProviderClient | null = null;
  private userPoolId: string | null = null;
  private clientId: string | null = null;
  private region: string;
  private bypassMode: boolean;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    this.region =
      this.configService.get('AWS_COGNITO_REGION', { infer: true }) ||
      'us-east-1';
    this.bypassMode =
      this.configService.get('COGNITO_BYPASS', { infer: true }) ?? false;

    if (!this.bypassMode) {
      this.userPoolId = this.configService.get('AWS_COGNITO_USER_POOL_ID', {
        infer: true,
      });
      this.clientId = this.configService.get('AWS_COGNITO_CLIENT_ID', {
        infer: true,
      });

      if (this.userPoolId && this.clientId) {
        this.client = new CognitoIdentityProviderClient({
          region: this.region,
        });
        this.logger.log('Cognito client initialized');
      } else {
        this.logger.warn(
          'Cognito configuration incomplete. Using local bypass mode.',
        );
        this.bypassMode = true;
      }
    } else {
      this.logger.log('Cognito bypass mode enabled (development)');
    }
  }

  /**
   * Check if Cognito is enabled (not in bypass mode)
   */
  isEnabled(): boolean {
    return !this.bypassMode && this.client !== null;
  }

  /**
   * Authenticate user with Cognito
   * In bypass mode, returns null to use local authentication
   */
  async authenticate(
    email: string,
    password: string,
  ): Promise<CognitoAuthResult | null> {
    if (!this.isEnabled()) {
      return null; // Use local authentication
    }

    try {
      const command = new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId!,
        ClientId: this.clientId!,
        AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await this.client!.send(command);

      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed');
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken || '',
        idToken: response.AuthenticationResult.IdToken || '',
        refreshToken: response.AuthenticationResult.RefreshToken || '',
        expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
      };
    } catch (error) {
      this.logger.error(`Cognito authentication failed for ${email}`, error);
      throw error;
    }
  }

  /**
   * Get user from Cognito
   * In bypass mode, returns null
   */
  async getUser(cognitoSub: string): Promise<CognitoUser | null> {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId!,
        Username: cognitoSub,
      });

      const response = await this.client!.send(command);

      return {
        sub: response.Username || cognitoSub,
        email:
          response.UserAttributes?.find((attr) => attr.Name === 'email')
            ?.Value || '',
        emailVerified:
          response.UserAttributes?.find(
            (attr) => attr.Name === 'email_verified',
          )?.Value === 'true',
        status: response.UserStatus || 'UNKNOWN',
      };
    } catch (error) {
      this.logger.error(`Failed to get Cognito user: ${cognitoSub}`, error);
      return null;
    }
  }

  /**
   * Create user in Cognito
   * In bypass mode, generates a placeholder cognito_sub
   */
  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    temporaryPassword?: string,
  ): Promise<string> {
    if (!this.isEnabled()) {
      // Generate placeholder cognito_sub for local bypass mode
      const placeholderSub = `local_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      this.logger.debug(
        `Bypass mode: Generated placeholder cognito_sub: ${placeholderSub}`,
      );
      return placeholderSub;
    }

    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId!,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
        ],
        ...(temporaryPassword
          ? {
              MessageAction: MessageActionType.SUPPRESS,
              TemporaryPassword: temporaryPassword,
            }
          : {}),
      });

      const response = await this.client!.send(command);

      return response.User?.Username || email;
    } catch (error) {
      this.logger.error(`Failed to create Cognito user: ${email}`, error);
      throw error;
    }
  }

  /**
   * Set user password in Cognito
   * In bypass mode, does nothing (password stored locally)
   */
  async setUserPassword(
    cognitoSub: string,
    password: string,
    permanent: boolean = true,
  ): Promise<void> {
    if (!this.isEnabled()) {
      return; // Password will be stored locally
    }

    try {
      const command = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId!,
        Username: cognitoSub,
        Password: password,
        Permanent: permanent,
      });

      await this.client!.send(command);
    } catch (error) {
      this.logger.error(
        `Failed to set password for Cognito user: ${cognitoSub}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete user from Cognito
   * In bypass mode, does nothing
   */
  async deleteUser(cognitoSub: string): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    try {
      const command = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId!,
        Username: cognitoSub,
      });

      await this.client!.send(command);
    } catch (error) {
      this.logger.error(`Failed to delete Cognito user: ${cognitoSub}`, error);
      throw error;
    }
  }

  /**
   * Verify if a cognito_sub is from local bypass mode
   */
  isLocalBypassSub(cognitoSub: string): boolean {
    return cognitoSub.startsWith('local_');
  }

  /**
   * Generate a local bypass cognito_sub
   */
  generateLocalBypassSub(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
