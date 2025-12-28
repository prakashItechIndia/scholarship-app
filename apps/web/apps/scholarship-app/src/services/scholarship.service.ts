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
   * Admin login with username and password (blocks Student users)
   */
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/scholarship-auth/login', {
      username,
      password,
    });
    return response.data;
  },

  /**
   * User login with username and password (allows Student users)
   */
  userLogin: async (username: string, password: string) => {
    const response = await apiClient.post('/scholarship-auth/user-login', {
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

  /**
   * Request password reset (forgot password)
   */
  forgotPassword: async (email: string) => {
    const response = await apiClient.post<{ message: string }>(
      '/scholarship-auth/forgot-password',
      { email },
    );
    return response.data;
  },

  /**
   * Reset password using token
   */
  resetPassword: async (email: string, token: string, newPassword: string) => {
    const response = await apiClient.post<{ message: string }>(
      '/scholarship-auth/reset-password',
      { email, token, newPassword },
    );
    return response.data;
  },
};

/**
 * Dashboard Service
 */
export const dashboard = {
  /**
   * Get financial summary
   */
  getFinancialSummary: async (academicYearId?: number) => {
    const params = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const response = await apiClient.get(`/dashboard/financial-summary${params}`);
    return response.data;
  },

  /**
   * Get application analytics
   */
  getApplicationAnalytics: async (academicYearId?: number) => {
    const params = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const response = await apiClient.get(`/dashboard/application-analytics${params}`);
    return response.data;
  },

  /**
   * Get recent applications
   */
  getRecentApplications: async (limit = 10, academicYearId?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (academicYearId) params.append('academicYearId', academicYearId.toString());
    const queryString = params.toString();
    const response = await apiClient.get(`/dashboard/recent-applications${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  /**
   * Get application activity by month
   */
  getApplicationActivity: async (academicYearId?: number) => {
    const params = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const response = await apiClient.get(`/dashboard/application-activity${params}`);
    return response.data;
  },

  /**
   * Get scholarship program distribution
   */
  getProgramDistribution: async (academicYearId?: number) => {
    const params = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const response = await apiClient.get(`/dashboard/program-distribution${params}`);
    return response.data;
  },

  /**
   * Get application status breakdown by month
   */
  getApplicationStatus: async (month?: string, academicYearId?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (academicYearId) params.append('academicYearId', academicYearId.toString());
    const queryString = params.toString();
    const response = await apiClient.get(`/dashboard/application-status${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit = 5) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`/dashboard/recent-activities${params}`);
    return response.data;
  },

  /**
   * Get performance metrics
   */
  getPerformanceMetrics: async (academicYearId?: number) => {
    const params = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const response = await apiClient.get(`/dashboard/performance-metrics${params}`);
    return response.data;
  },

  /**
   * Get fund spending data
   */
  getFundSpending: async (yearRange?: string, academicYearId?: number) => {
    const params = new URLSearchParams();
    if (yearRange) params.append('yearRange', yearRange);
    if (academicYearId) params.append('academicYearId', academicYearId.toString());
    const queryString = params.toString();
    const response = await apiClient.get(`/dashboard/fund-spending${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  /**
   * Get calendar events
   */
  getCalendarEvents: async (month?: string, academicYearId?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (academicYearId) params.append('academicYearId', academicYearId.toString());
    const queryString = params.toString();
    const response = await apiClient.get(`/dashboard/calendar-events${queryString ? `?${queryString}` : ''}`);
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
    const response = await apiClient.post<{
      applicationId?: string;
      Application_Id?: string;
      message?: string;
    }>('/scholarship-application/register', applicationData);
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

/**
 * Document Upload Service
 */
export const documentUpload = {
  /**
   * Upload a single document
   */
  uploadDocument: async (
    applicationId: string,
    documentType: string,
    file: File,
    uploadedBy?: number,
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId);
    formData.append('documentType', documentType);
    if (uploadedBy !== undefined) {
      formData.append('uploadedBy', uploadedBy.toString());
    }

    const response = await apiClient.post<{
      message: string;
      documentPath: string;
    }>('/document-upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload multiple documents
   */
  uploadMultipleDocuments: async (
    applicationId: string,
    files: File[],
    documentTypes: string[],
    uploadedBy?: number,
  ) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('applicationId', applicationId);
    formData.append('documentTypes', documentTypes.join(','));
    if (uploadedBy !== undefined) {
      formData.append('uploadedBy', uploadedBy.toString());
    }

    const response = await apiClient.post<{
      message: string;
      results: { message: string; documentPath: string }[];
    }>('/document-upload/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload student photo
   */
  uploadPhoto: async (applicationId: string, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('applicationId', applicationId);

    const response = await apiClient.post<{
      message: string;
      photoPath: string;
    }>('/document-upload/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get documents for an application
   */
  getApplicationDocuments: async (applicationId: string) => {
    const response = await apiClient.get<
      {
        Document_Id: number;
        Application_Id: string;
        Document_Type: string;
        Document_Path: string;
        Document_URL?: string; // Full URL from backend
        Uploaded_Date: string;
        Uploaded_By?: number;
      }[]
    >(`/document-upload/documents/${applicationId}`);
    return response.data;
  },

  /**
   * Get document types
   */
  getDocumentTypes: async () => {
    const response = await apiClient.get<{
      documentTypes: string[];
    }>('/document-upload/document-types');
    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (
    documentId: number,
    applicationId?: string,
    documentType?: string,
  ) => {
    const response = await apiClient.delete<{
      message: string;
    }>(`/document-upload/document/${documentId}`, {
      params: {
        applicationId,
        documentType,
      },
    });
    return response.data;
  },

  /**
   * Get document file URL for viewing
   * Returns a blob URL that can be used in iframe or img src
   */
  getDocumentViewUrl: async (applicationId: string, documentType: string): Promise<string> => {
    // Return the API endpoint URL - the browser will fetch it as a blob
    const apiBaseUrl = import.meta.env.VITE_SSO_API_URL || 'http://localhost:3000/api';
    return `${apiBaseUrl}/document-upload/view/${encodeURIComponent(applicationId)}/${encodeURIComponent(documentType)}`;
  },
};

/**
 * Dropdown Options Service
 */
export const dropdownOptions = {
  /**
   * Get all countries
   */
  getCountries: async () => {
    const response = await apiClient.get<
      { value: string; label: string }[]
    >('/dropdown-options/countries');
    return response.data;
  },

  /**
   * Get states by country ID
   */
  getStates: async (countryId?: string) => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/states',
      { params: countryId ? { countryId } : {} },
    );
    return response.data;
  },

  /**
   * Get districts by state ID
   */
  getDistricts: async (stateId?: string) => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/districts',
      { params: stateId ? { stateId } : {} },
    );
    return response.data;
  },

  /**
   * Get all communities
   */
  getCommunities: async () => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/communities',
    );
    return response.data;
  },

  /**
   * Get castes by community
   */
  getCastes: async (community?: string) => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/castes',
      { params: community ? { community } : {} },
    );
    return response.data;
  },

  /**
   * Get all occupations
   */
  getOccupations: async () => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/occupations',
    );
    return response.data;
  },

  /**
   * Get annual income ranges
   */
  getAnnualIncomeRanges: async () => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/annual-income-ranges',
    );
    return response.data;
  },

  /**
   * Get all bank names
   */
  getBankNames: async () => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/bank-names',
    );
    return response.data;
  },

  /**
   * Get bank branches by bank ID
   */
  getBankBranches: async (bankId?: string) => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/bank-branches',
      { params: bankId ? { bankId } : {} },
    );
    return response.data;
  },

  /**
   * Get applicant categories
   */
  getApplicantCategories: async () => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/applicant-categories',
    );
    return response.data;
  },

  /**
   * Get degree options by course and degree type
   */
  getDegrees: async (course: string, degreeType: string) => {
    const response = await apiClient.get<{ value: string; label: string }[]>(
      '/dropdown-options/degrees',
      { params: { course, degreeType } },
    );
    return response.data;
  },
};

/**
 * Screen interface
 */
export interface Screen {
  id: number;
  screenName: string;
  url: string;
  isActive: boolean;
}

/**
 * Role Management Service
 */
export const roleManagement = {
  /**
   * Get all roles with optional sorting and pagination
   */
  getAllRoles: async (params?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `/role-management/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Export roles to Excel or Word
   */
  exportRoles: async (
    format: 'excel' | 'word',
    params?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await apiClient.get(
      `/role-management/export/${format}?${queryParams.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRoleById: async (roleId: number) => {
    const response = await apiClient.get(`/role-management/role/${roleId}`);
    return response.data;
  },

  /**
   * Check if role name exists
   */
  checkRoleName: async (roleName: string) => {
    const response = await apiClient.get(`/role-management/check-role-name/${encodeURIComponent(roleName)}`);
    return response.data;
  },

  /**
   * Check if role has assigned users
   */
  checkRoleHasUsers: async (roleId: number) => {
    const response = await apiClient.get(`/role-management/check-role-users/${roleId}`);
    return response.data;
  },

  /**
   * Create new role
   */
  createRole: async (roleData: {
    roleName: string;
    userType: string;
    isActive: number;
  }) => {
    const response = await apiClient.post('/role-management/role', roleData);
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (roleId: number, roleData: {
    roleName: string;
    userType: string;
    isActive: number;
  }) => {
    const response = await apiClient.put(`/role-management/role/${roleId}`, roleData);
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (roleId: number) => {
    const response = await apiClient.delete(`/role-management/role/${roleId}`);
    return response.data;
  },

  /**
   * Get all available screens
   */
  getAllScreens: async () => {
    const response = await apiClient.get('/role-management/screens');
    return response.data;
  },

  /**
   * Get permissions for a role
   */
  getRolePermissions: async (roleId: number) => {
    const response = await apiClient.get(
      `/role-management/role/${roleId}/permissions`,
    );
    return response.data;
  },

  /**
   * Get role with all permissions
   */
  getRoleWithPermissions: async (roleId: number) => {
    const response = await apiClient.get(
      `/role-management/role/${roleId}/permissions-full`,
    );
    return response.data;
  },

  /**
   * Get permissions for a user
   */
  getUserPermissions: async (userId: number) => {
    const response = await apiClient.get(
      `/role-management/user/${userId}/permissions`,
    );
    return response.data;
  },

  /**
   * Check if user has permission to access a screen
   */
  hasScreenPermission: async (userId: number, screenUrl: string) => {
    const response = await apiClient.get(
      `/role-management/user/${userId}/has-permission?screenUrl=${encodeURIComponent(screenUrl)}`,
    );
    return response.data.hasPermission;
  },

  /**
   * Update permissions for a role with action-level permissions
   */
  updateRolePermissions: async (
    roleId: number,
    permissions: Array<{
      screenId: number;
      canCreate: boolean;
      canView: boolean;
      canUpdate: boolean;
      canDelete: boolean;
    }>,
  ) => {
    const response = await apiClient.put(
      `/role-management/role/${roleId}/permissions`,
      { permissions },
    );
    return response.data;
  },

  /**
   * Check if user has permission for a specific action on a screen
   */
  hasActionPermission: async (
    userId: number,
    screenUrl: string,
    action: 'create' | 'view' | 'update' | 'delete',
  ) => {
    const response = await apiClient.get(
      `/role-management/user/${userId}/has-action-permission?screenUrl=${encodeURIComponent(screenUrl)}&action=${action}`,
    );
    return response.data.hasPermission;
  },
};

/**
 * User Management Service
 */
export const userManagement = {
  /**
   * Get all users with optional sorting and pagination
   */
  getAllUsers: async (params?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `/user-management/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Export users to Excel or Word
   */
  exportUsers: async (
    format: 'excel' | 'word',
    params?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await apiClient.get(
      `/user-management/export/${format}?${queryParams.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get user types/roles
   */
  getUserTypes: async () => {
    const response = await apiClient.get('/user-management/user-types');
    return response.data;
  },

  /**
   * Check if user ID exists
   */
  checkUserId: async (userId: string) => {
    const response = await apiClient.get(`/user-management/check-user/${encodeURIComponent(userId)}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string) => {
    const response = await apiClient.get(`/user-management/user/${encodeURIComponent(userId)}`);
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (userData: {
    userType: number;
    name: string;
    userName: string;
    password: string;
    mobileNumber: string;
    email: string;
    isActive: number;
  }) => {
    const response = await apiClient.post('/user-management/user', userData);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (userData: {
    userType: number;
    name: string;
    userName: string;
    password: string;
    mobileNumber: string;
    email: string;
    isActive: number;
  }) => {
    const response = await apiClient.put('/user-management/user', userData);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/user-management/user/${encodeURIComponent(userId)}`);
    return response.data;
  },

  /**
   * Upload/Update profile image for a user
   */
  uploadProfileImage: async (
    userId: string,
    file: File,
    action: 'add' | 'update' = 'update',
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', action);

    const response = await apiClient.post<{
      message: string;
      profileImagePath: string | null;
    }>(`/user-management/user/${encodeURIComponent(userId)}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Remove profile image for a user
   */
  removeProfileImage: async (userId: string) => {
    const response = await apiClient.delete<{
      message: string;
      profileImagePath: string | null;
    }>(`/user-management/user/${encodeURIComponent(userId)}/profile-image`);
    return response.data;
  },
};

/**
 * Process Management Service
 */
export const processManagement = {
  /**
   * Get applications for Overview tab
   */
  getOverviewApplications: async (params: {
    mainCategory?: string;
    key?: string;
    selectedStatusText?: string;
    fromDate?: string;
    toDate?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/overview', {
      params,
    });
    return response.data;
  },

  /**
   * Get applications for Documents tab
   */
  getDocumentsApplications: async (params: {
    mainCategory?: string;
    key?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/documents', {
      params,
    });
    return response.data;
  },

  /**
   * Get applications for Verify tab
   */
  getVerifyApplications: async (params: {
    mainCategory?: string;
    key?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/verify', {
      params,
    });
    return response.data;
  },

  /**
   * Get applications for Suggest tab
   */
  getSuggestApplications: async (params: {
    mainCategory?: string;
    key?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/suggest', {
      params,
    });
    return response.data;
  },

  /**
   * Get applications for Approve tab
   */
  getApproveApplications: async (params: {
    mainCategory?: string;
    key?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/approve', {
      params,
    });
    return response.data;
  },

  /**
   * Get applications for Issue Amount tab
   */
  getIssueAmountApplications: async (params: {
    mainCategory?: string;
    key?: string;
    academicYearId?: number;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/process-management/applications/issue-amount', {
      params,
    });
    return response.data;
  },

  /**
   * Verify application
   */
  verifyApplication: async (data: {
    applicationId: string;
    status: 'Verified' | 'Recheck' | 'Reject';
    remarks?: string;
    verifiedBy?: number;
  }) => {
    const response = await apiClient.post('/process-management/verify', data);
    return response.data;
  },

  /**
   * Suggest amount
   */
  suggestAmount: async (data: {
    applicationId: string;
    suggestedAmount: number;
    remarks?: string;
    suggestedBy?: number;
  }) => {
    const response = await apiClient.post('/process-management/suggest', data);
    return response.data;
  },

  /**
   * Approve application
   */
  approveApplication: async (data: {
    applicationId: string;
    approvedAmount: number;
    status: 'Approved' | 'Rejected';
    remarks?: string;
    approvedBy?: number;
  }) => {
    const response = await apiClient.post('/process-management/approve', data);
    return response.data;
  },

  /**
   * Issue amount
   */
  issueAmount: async (data: {
    applicationId: string;
    scholarshipId?: number;
    paymentMode: string;
    comments?: string;
    ddChequeNo?: string;
    ddChequeInFavor?: string;
    ddChequeDate?: string;
    ddChequeInFavorType?: string;
    ddChequeInstitutionId?: number;
    ddChequeOtherInstitution?: string;
    ddChequeIssuedBy?: number;
    scholarshipIssuedDate?: string;
    bankName?: string;
    branchDetails?: string;
    documents?: File[];
    issuedBy?: number;
  }) => {
    const formData = new FormData();
    formData.append('applicationId', data.applicationId);
    if (data.scholarshipId) formData.append('scholarshipId', data.scholarshipId.toString());
    formData.append('paymentMode', data.paymentMode);
    if (data.comments) formData.append('comments', data.comments);
    if (data.ddChequeNo) formData.append('ddChequeNo', data.ddChequeNo);
    if (data.ddChequeInFavor) formData.append('ddChequeInFavor', data.ddChequeInFavor);
    if (data.ddChequeDate) formData.append('ddChequeDate', data.ddChequeDate);
    if (data.ddChequeInFavorType) formData.append('ddChequeInFavorType', data.ddChequeInFavorType);
    if (data.ddChequeInstitutionId) formData.append('ddChequeInstitutionId', data.ddChequeInstitutionId.toString());
    if (data.ddChequeOtherInstitution) formData.append('ddChequeOtherInstitution', data.ddChequeOtherInstitution);
    if (data.ddChequeIssuedBy) formData.append('ddChequeIssuedBy', data.ddChequeIssuedBy.toString());
    if (data.scholarshipIssuedDate) formData.append('scholarshipIssuedDate', data.scholarshipIssuedDate);
    if (data.bankName) formData.append('bankName', data.bankName);
    if (data.branchDetails) formData.append('branchDetails', data.branchDetails);
    if (data.issuedBy) formData.append('issuedBy', data.issuedBy.toString());
    
    // Append uploaded documents
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }

    const response = await apiClient.post('/process-management/issue-amount', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get merged scholarship PDF (with uploaded document in middle)
   */
  getMergedScholarshipPDF: async (params: {
    applicationId: string;
    scholarshipId: string;
  }) => {
    const response = await apiClient.get('/process-management/scholarship-pdf', {
      params,
      responseType: 'blob',
    });
    // Create a blob URL from the response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  },

  /**
   * Get application history (View History)
   */
  getApplicationHistory: async (
    applicationId: string,
    params?: { page?: number; pageSize?: number; getAllRecords?: boolean },
  ) => {
    const response = await apiClient.get(`/process-management/history/${applicationId}`, {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        getAllRecords: params?.getAllRecords,
      },
    });
    return response.data;
  },

  /**
   * Get scholarship history (Previous Scholarship History)
   */
  getScholarshipHistory: async (applicationId: string) => {
    const response = await apiClient.get(`/process-management/scholarship-history/${applicationId}`);
    return response.data;
  },
};

/**
 * Reports Service
 */
export const reports = {
  /**
   * Get academic years
   */
  getAcademicYears: async () => {
    const response = await apiClient.get('/reports/academic-years');
    return response.data;
  },

  /**
   * Get categories wise report
   */
  getCategoriesWiseReport: async (filters: {
    academicYear?: number;
    mainCategory?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    amount?: string;
    gender?: string;
    issuedTo?: string;
    sairamCategory?: string;
    institutionName?: string;
    parentOffice?: string;
    favourCategory?: string;
    favourGroup?: string;
    keyword?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.academicYear) params.append('academicYear', filters.academicYear.toString());
    if (filters.mainCategory) params.append('mainCategory', filters.mainCategory);
    if (filters.status) params.append('status', filters.status);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.amount) params.append('amount', filters.amount);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.issuedTo) params.append('issuedTo', filters.issuedTo);
    if (filters.sairamCategory) params.append('sairamCategory', filters.sairamCategory);
    if (filters.institutionName) params.append('institutionName', filters.institutionName);
    if (filters.parentOffice) params.append('parentOffice', filters.parentOffice);
    if (filters.favourCategory) params.append('favourCategory', filters.favourCategory);
    if (filters.favourGroup) params.append('favourGroup', filters.favourGroup);
    if (filters.keyword) params.append('keyword', filters.keyword);

    const response = await apiClient.get(`/reports/categories?${params.toString()}`);
    return response.data;
  },

  /**
   * Get scholarship issued report
   */
  getScholarshipIssuedReport: async (filters: {
    fromDate?: string;
    toDate?: string;
    institutionId?: number;
    strInstitution?: string;
    chequeInFavorType?: string;
    intIssuedBy?: number;
    strIssuedBy?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.institutionId) params.append('institutionId', filters.institutionId.toString());
    if (filters.strInstitution) params.append('strInstitution', filters.strInstitution);
    if (filters.chequeInFavorType) params.append('chequeInFavorType', filters.chequeInFavorType);
    if (filters.intIssuedBy) params.append('intIssuedBy', filters.intIssuedBy.toString());
    if (filters.strIssuedBy) params.append('strIssuedBy', filters.strIssuedBy);

    const response = await apiClient.get(`/reports/scholarship-issued?${params.toString()}`);
    return response.data;
  },

  /**
   * Get cheque issued by options
   */
  getChequeIssuedBy: async () => {
    const response = await apiClient.get('/reports/cheque-issued-by');
    return response.data;
  },

  /**
   * Export report to PDF, Excel, CSV, or Word
   * Uses backend export endpoint that supports up to 100,000 records
   */
  exportReport: async (
    reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    format: 'pdf' | 'excel' | 'csv' | 'word',
    filters: any
  ) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key].toString());
      }
    });

    const response = await apiClient.get(
      `/reports/export/${reportType}/${format}?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * @deprecated Use exportReport instead
   * Export report to PDF
   */
  exportToPdf: async (reportType: 'categories' | 'scholarship-issued', filters: any) => {
    return reports.exportReport(reportType, 'pdf', filters);
  },

  /**
   * @deprecated Use exportReport instead
   * Export report to Excel
   */
  exportToExcel: async (reportType: 'categories' | 'scholarship-issued', filters: any) => {
    return reports.exportReport(reportType, 'excel', filters);
  },
};

