/**
 * AWS Secrets Manager Service
 * Provides secure access to secrets stored in AWS Secrets Manager
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DescribeSecretCommand,
} from '@aws-sdk/client-secrets-manager';

export interface SecretConfig {
  region?: string;
  secretName: string;
}

export interface SecretValue {
  [key: string]: string | number | boolean;
}

@Injectable()
export class SecretsManagerService {
  private readonly client: SecretsManagerClient;
  private readonly logger = new Logger(SecretsManagerService.name);
  private readonly cache = new Map<
    string,
    { value: SecretValue; expiresAt: number }
  >();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly config: SecretConfig) {
    this.client = new SecretsManagerClient({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
    });
  }

  /**
   * Get secret value from AWS Secrets Manager
   * Results are cached for 5 minutes to reduce API calls
   */
  async getSecret(secretName?: string): Promise<SecretValue> {
    const name = secretName || this.config.secretName;

    // Check cache first
    const cached = this.cache.get(name);
    if (cached && Date.now() < cached.expiresAt) {
      this.logger.debug(`Using cached secret for ${name}`);
      return cached.value;
    }

    try {
      const command = new GetSecretValueCommand({
        SecretId: name,
      });

      const response = await this.client.send(command);

      if (!response.SecretString) {
        throw new Error(`Secret ${name} has no string value`);
      }

      const secretValue = JSON.parse(response.SecretString) as SecretValue;

      // Cache the result
      this.cache.set(name, {
        value: secretValue,
        expiresAt: Date.now() + this.cacheTTL,
      });

      this.logger.log(`Successfully retrieved secret: ${name}`);
      return secretValue;
    } catch (error) {
      this.logger.error(`Failed to retrieve secret ${name}:`, error);
      throw new Error(
        `Failed to retrieve secret ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get a specific key from a secret
   */
  async getSecretValue(key: string, secretName?: string): Promise<string> {
    const secret = await this.getSecret(secretName);
    const value = secret[key];

    if (value === undefined) {
      throw new Error(
        `Key ${key} not found in secret ${secretName || this.config.secretName}`,
      );
    }

    return String(value);
  }

  /**
   * Create a new secret in AWS Secrets Manager
   */
  async createSecret(
    secretName: string,
    secretValue: SecretValue,
    description?: string,
  ): Promise<void> {
    try {
      const command = new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
        Description: description,
      });

      await this.client.send(command);
      this.logger.log(`Successfully created secret: ${secretName}`);
    } catch (error) {
      this.logger.error(`Failed to create secret ${secretName}:`, error);
      throw new Error(
        `Failed to create secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Update an existing secret in AWS Secrets Manager
   */
  async updateSecret(
    secretName: string,
    secretValue: SecretValue,
  ): Promise<void> {
    try {
      const command = new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: JSON.stringify(secretValue),
      });

      await this.client.send(command);

      // Invalidate cache
      this.cache.delete(secretName);

      this.logger.log(`Successfully updated secret: ${secretName}`);
    } catch (error) {
      this.logger.error(`Failed to update secret ${secretName}:`, error);
      throw new Error(
        `Failed to update secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if a secret exists
   */
  async secretExists(secretName: string): Promise<boolean> {
    try {
      const command = new DescribeSecretCommand({
        SecretId: secretName,
      });

      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear the cache for a specific secret
   */
  clearCache(secretName?: string): void {
    const name = secretName || this.config.secretName;
    this.cache.delete(name);
    this.logger.debug(`Cleared cache for secret: ${name}`);
  }

  /**
   * Clear all cached secrets
   */
  clearAllCache(): void {
    this.cache.clear();
    this.logger.debug('Cleared all secret caches');
  }
}
