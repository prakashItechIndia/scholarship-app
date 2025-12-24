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
      results: Array<{ message: string; documentPath: string }>;
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
  getDocuments: async (applicationId: string) => {
    const response = await apiClient.get<
      {
        Document_Id: number;
        Application_Id: string;
        Document_Type: string;
        Document_Path: string;
        Uploaded_Date: string;
        Uploaded_By?: number;
      }[]
    >(`/document-upload/documents/${applicationId}`);
    return response.data;
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
      Array<{ value: string; label: string }>
    >('/dropdown-options/countries');
    return response.data;
  },

  /**
   * Get states by country ID
   */
  getStates: async (countryId?: string) => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/states',
      { params: countryId ? { countryId } : {} },
    );
    return response.data;
  },

  /**
   * Get districts by state ID
   */
  getDistricts: async (stateId?: string) => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/districts',
      { params: stateId ? { stateId } : {} },
    );
    return response.data;
  },

  /**
   * Get all communities
   */
  getCommunities: async () => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/communities',
    );
    return response.data;
  },

  /**
   * Get castes by community
   */
  getCastes: async (community?: string) => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/castes',
      { params: community ? { community } : {} },
    );
    return response.data;
  },

  /**
   * Get all occupations
   */
  getOccupations: async () => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/occupations',
    );
    return response.data;
  },

  /**
   * Get annual income ranges
   */
  getAnnualIncomeRanges: async () => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
      '/dropdown-options/annual-income-ranges',
    );
    return response.data;
  },

  /**
   * Get all bank names
   */
  getBankNames: async () => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>(
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
 * Role Management Service
 */
export const roleManagement = {
  /**
   * Get all roles
   */
  getAllRoles: async () => {
    const response = await apiClient.get('/role-management/roles');
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
};

/**
 * User Management Service
 */
export const userManagement = {
  /**
   * Get all users
   */
  getAllUsers: async () => {
    const response = await apiClient.get('/user-management/users');
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
    paymentMode: string;
    comments?: string;
    ddChequeNo?: string;
    ddChequeInFavor?: string;
    ddChequeDate?: string;
    issuedBy?: number;
  }) => {
    const response = await apiClient.post('/process-management/issue-amount', data);
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
};

