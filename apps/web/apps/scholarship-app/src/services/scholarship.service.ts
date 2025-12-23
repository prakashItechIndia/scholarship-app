import { AxiosInstance } from 'axios';
import {
  ScholarshipAuthenticationApi,
  ScholarshipApplicationApi,
  Configuration,
  ConfigurationParameters,
} from '@shared/_api';
import { apiClient } from '../shared/api-client';

/**
 * Create scholarship API clients with proper configuration
 */
const createScholarshipApiClients = (
  axiosInstance: AxiosInstance,
  basePath?: string,
): {
  auth: ScholarshipAuthenticationApi;
  application: ScholarshipApplicationApi;
} => {
  const hasBaseURL = !!axiosInstance.defaults.baseURL;
  const effectiveBasePath = basePath ?? (hasBaseURL ? '' : undefined);

  const config: ConfigurationParameters = {
    basePath: effectiveBasePath ?? '',
    baseOptions: axiosInstance.defaults,
  };

  const configuration = new Configuration(config);

  return {
    auth: new ScholarshipAuthenticationApi(
      configuration,
      effectiveBasePath ?? '',
      axiosInstance,
    ),
    application: new ScholarshipApplicationApi(
      configuration,
      effectiveBasePath ?? '',
      axiosInstance,
    ),
  };
};

// Create typed API clients
const scholarshipApis = createScholarshipApiClients(apiClient);

/**
 * Scholarship Authentication Service
 */
export const scholarshipAuth = {
  /**
   * Login with username and password
   */
  login: async (username: string, password: string) => {
    const response = await scholarshipApis.auth.scholarshipAuthControllerLogin({
      username,
      password,
    });
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    username: string,
    currentPassword: string,
    newPassword: string,
  ) => {
    const response =
      await scholarshipApis.auth.scholarshipAuthControllerChangePassword({
        username,
        currentPassword,
        newPassword,
      });
    return response.data;
  },
};

/**
 * Scholarship Application Service
 */
export const scholarshipApplication = {
  /**
   * Get active scholarship year settings
   */
  getScholarshipYear: async () => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerGetScholarshipYear();
    return response.data;
  },

  /**
   * Check if Aadhaar ID exists
   */
  checkAadhaarId: async (aadhaarId: string, scholarshipYearId: number) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerCheckAadhaarId(
        aadhaarId,
        scholarshipYearId,
      );
    return response.data;
  },

  /**
   * Check if PAN ID exists
   */
  checkPanId: async (panId: string, scholarshipYearId: number) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerCheckPanId(
        panId,
        scholarshipYearId,
      );
    return response.data;
  },

  /**
   * Register new scholarship application
   */
  register: async (applicationData: Record<string, unknown>) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerRegister(
        applicationData,
      );
    return response.data;
  },

  /**
   * Check if email exists in the system
   */
  checkEmailExists: async (email: string) => {
    // Use getApplications to check if email exists
    // If any applications exist, email is registered
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerGetApplications(
        email,
      );
    const applications = response.data;
    return Array.isArray(applications) && applications.length > 0;
  },

  /**
   * Get applications by email
   */
  getApplications: async (email: string) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerGetApplications(
        email,
      );
    return response.data;
  },

  /**
   * Get application by application ID
   */
  getApplication: async (
    applicationId: string,
    processType?: string,
    scholarshipId?: number,
  ) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerGetApplication(
        applicationId,
        processType,
        scholarshipId,
      );
    return response.data;
  },

  /**
   * Update application
   */
  updateApplication: async (applicationId: string, updateData: Record<string, unknown>) => {
    const response =
      await scholarshipApis.application.scholarshipApplicationControllerUpdateApplication(
        applicationId,
        updateData,
      );
    return response.data;
  },

  /**
   * Send verification email for new user onboarding
   */
  sendVerificationEmail: async (email: string) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/scholarship-application/send-verification-email',
      { email },
    );
    return response.data;
  },

  /**
   * Verify email token
   */
  verifyEmailToken: async (token: string) => {
    const response = await apiClient.get<{ valid: boolean; email?: string; message: string }>(
      `/scholarship-application/verify-email-token/${token}`,
    );
    return response.data;
  },

  /**
   * Check user login status (email exists and password set)
   */
  checkUserLoginStatus: async (email: string) => {
    const response = await apiClient.get<{
      emailExists: boolean;
      hasPassword: boolean;
      canLogin: boolean;
      needsOnboarding: boolean;
    }>(`/scholarship-application/check-login-status/${email}`);
    return response.data;
  },

  /**
   * Set new password for user
   */
  setNewPassword: async (email: string, password: string, token?: string) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/scholarship-application/set-password',
      { email, password, token },
    );
    return response.data;
  },
};

