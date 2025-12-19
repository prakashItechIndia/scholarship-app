import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as admin from 'firebase-admin';
import type { EnvVars } from '../../config/env.validation';

interface FirestoreUserProfile {
  organization: string | null;
  phone_number: string | null;
  state: string | null;
  country: string | null;
  mfa_enabled: boolean;
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private initialized = false;

  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly httpService: HttpService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) return;

    const projectId = this.configService.get('FIREBASE_PROJECT_ID', {
      infer: true,
    });
    const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL', {
      infer: true,
    });
    const privateKeyRaw = this.configService.get('FIREBASE_PRIVATE_KEY', {
      infer: true,
    });

    if (!projectId || !clientEmail || !privateKeyRaw) {
      this.logger.warn(
        'Firebase credentials are not fully configured. Skipping Firebase initialization.',
      );
      return;
    }

    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      this.initialized = true;
      this.logger.log('Firebase Admin initialized');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firebase Admin',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        'Firebase Admin is not initialized. Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
      );
    }
  }

  /**
   * Create Firebase Auth user
   * @param params - User creation parameters
   * @returns Firebase UID
   */
  async createUser(params: {
    email: string;
    password: string;
    phoneNumber?: string | null;
  }): Promise<string> {
    this.ensureInitialized();
    const userRecord = await admin.auth().createUser({
      email: params.email,
      password: params.password,
      phoneNumber: params.phoneNumber ?? undefined,
      disabled: false,
      emailVerified: true, // Email is already verified through our activation flow
    });
    return userRecord.uid;
  }

  /**
   * Set Firestore user profile
   * @param firebaseUid - Firebase user UID
   * @param profile - User profile data
   */
  async setFirestoreUser(
    firebaseUid: string,
    profile: FirestoreUserProfile,
  ): Promise<void> {
    this.ensureInitialized();
    await admin.firestore().collection('users').doc(firebaseUid).set(profile, {
      merge: true,
    });
    this.logger.log(`Firestore profile set for user: ${firebaseUid}`);
  }

  /**
   * Create a custom token for a Firebase user
   * This token can be exchanged for an idToken on the client side
   * @param firebaseUid - Firebase user UID
   * @returns Custom token string
   */
  async createCustomToken(firebaseUid: string): Promise<string> {
    this.ensureInitialized();
    return await admin.auth().createCustomToken(firebaseUid);
  }

  /**
   * Get user by Firebase UID
   * @param firebaseUid - Firebase user UID
   * @returns User record or null
   */
  async getUserByUid(
    firebaseUid: string,
  ): Promise<admin.auth.UserRecord | null> {
    this.ensureInitialized();
    try {
      return await admin.auth().getUser(firebaseUid);
    } catch (error) {
      this.logger.warn(
        `Firebase user not found: ${firebaseUid}`,
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  /**
   * Get user by email
   * Useful when createUser fails because the account already exists
   */
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
    this.ensureInitialized();
    try {
      return await admin.auth().getUserByEmail(email);
    } catch (error) {
      this.logger.warn(
        `Firebase user not found by email: ${email}`,
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  /**
   * Get user by phone number
   */
  async getUserByPhoneNumber(
    phoneNumber: string,
  ): Promise<admin.auth.UserRecord | null> {
    this.ensureInitialized();
    try {
      return await admin.auth().getUserByPhoneNumber(phoneNumber);
    } catch (error) {
      this.logger.warn(
        `Firebase user not found by phone: ${phoneNumber}`,
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  /**
   * Exchange Firebase custom token for idToken using Firebase REST API
   * @param customToken - Custom token from createCustomToken
   * @returns idToken and expiration timestamp
   */
  async exchangeCustomTokenForIdToken(
    customToken: string,
  ): Promise<{ idToken: string; expiresAt: Date }> {
    this.ensureInitialized();
    const apiKey = this.configService.get('FIREBASE_API_KEY', { infer: true });
    const projectId = this.configService.get('FIREBASE_PROJECT_ID', {
      infer: true,
    });

    if (!apiKey || !projectId) {
      throw new Error(
        'FIREBASE_API_KEY and FIREBASE_PROJECT_ID must be configured to exchange tokens',
      );
    }

    try {
      // Firebase REST API endpoint to exchange custom token for idToken
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;

      const response = await firstValueFrom(
        this.httpService.post<{
          idToken: string;
          refreshToken: string;
          expiresIn: string; // e.g., "3600"
        }>(url, {
          token: customToken,
          returnSecureToken: true,
        }),
      );

      const { idToken, expiresIn } = response.data;
      const expiresInSeconds = Number.parseInt(expiresIn, 10) || 3600; // Default to 1 hour
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

      return { idToken, expiresAt };
    } catch (error) {
      this.logger.error(
        'Failed to exchange custom token for idToken',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Failed to exchange custom token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get or refresh Firebase idToken for a user
   * Checks if existing token is valid, otherwise creates new one
   * @param firebaseUid - Firebase user UID
   * @param currentToken - Current idToken from DB (optional)
   * @param expiresAt - Current token expiration (optional)
   * @returns idToken and expiration timestamp
   */
  async getIdToken(
    firebaseUid: string,
    currentToken?: string | null,
    expiresAt?: Date | null,
  ): Promise<{ idToken: string; expiresAt: Date }> {
    this.ensureInitialized();

    // Check if current token is still valid (not expired, with 5 minute buffer)
    if (currentToken && expiresAt) {
      const bufferTime = 5 * 60 * 1000; // 5 minutes
      const now = new Date();
      const expirationTime = new Date(expiresAt);

      if (expirationTime.getTime() > now.getTime() + bufferTime) {
        // Token is still valid
        return { idToken: currentToken, expiresAt: expirationTime };
      }
    }

    // Token expired or missing - create new one
    this.logger.log(`Refreshing Firebase idToken for user: ${firebaseUid}`);

    // Create custom token
    const customToken = await this.createCustomToken(firebaseUid);

    // Exchange for idToken
    return await this.exchangeCustomTokenForIdToken(customToken);
  }

  /**
   * Update Firebase Auth user password
   * @param firebaseUid - Firebase user UID
   * @param newPassword - New password
   */
  async updatePassword(
    firebaseUid: string,
    newPassword: string,
  ): Promise<void> {
    this.ensureInitialized();
    try {
      await admin.auth().updateUser(firebaseUid, {
        password: newPassword,
      });
      this.logger.log(`Firebase password updated for user: ${firebaseUid}`);
    } catch (error) {
      this.logger.error(
        `Failed to update Firebase password for user ${firebaseUid}:`,
        error instanceof Error ? error.message : String(error),
      );
      // Don't throw - allow password change to succeed even if Firebase update fails
      // This is a sync operation, not critical for local password change
    }
  }

  /**
   * Update Firebase Auth user profile (email, phone, displayName)
   * @param firebaseUid - Firebase user UID
   * @param updates - User profile updates
   */
  async updateAuthUser(
    firebaseUid: string,
    updates: {
      email?: string;
      phoneNumber?: string | null;
      displayName?: string;
      photoURL?: string | null;
    },
  ): Promise<void> {
    this.ensureInitialized();
    try {
      const updateData: admin.auth.UpdateRequest = {};
      if (updates.email !== undefined) {
        updateData.email = updates.email;
        updateData.emailVerified = true; // Keep email verified
      }
      if (updates.phoneNumber !== undefined) {
        updateData.phoneNumber = updates.phoneNumber ?? undefined;
      }
      if (updates.displayName !== undefined) {
        updateData.displayName = updates.displayName;
      }
      if (updates.photoURL !== undefined) {
        updateData.photoURL = updates.photoURL ?? undefined;
      }

      await admin.auth().updateUser(firebaseUid, updateData);
      this.logger.log(
        `Firebase Auth user updated for ${firebaseUid}: ${Object.keys(updateData).join(', ')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update Firebase Auth user ${firebaseUid}:`,
        error instanceof Error ? error.message : String(error),
      );
      // Don't throw - allow profile update to succeed even if Firebase update fails
    }
  }

  /**
   * Update Firestore user profile
   * @param firebaseUid - Firebase user UID
   * @param profile - Partial profile data to update
   */
  async updateFirestoreUser(
    firebaseUid: string,
    profile: Partial<FirestoreUserProfile>,
  ): Promise<void> {
    this.ensureInitialized();
    try {
      await admin
        .firestore()
        .collection('users')
        .doc(firebaseUid)
        .set(profile, {
          merge: true,
        });
      this.logger.log(`Firestore profile updated for user: ${firebaseUid}`);
    } catch (error) {
      this.logger.error(
        `Failed to update Firestore profile for user ${firebaseUid}:`,
        error instanceof Error ? error.message : String(error),
      );
      // Don't throw - allow profile update to succeed even if Firestore update fails
    }
  }
}
