import { apiClient } from '../shared/api-client';
import { createSsoApiClients } from '@shared/common/sso-api-client';
import type {
  LoginRequestDto,
  LoginResponseDto,
  CreatePasswordDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  CheckEmailDto,
  GetMeResponseDto,
} from '@shared/_api';

// Create typed API clients
// Don't pass basePath - apiClient already has baseURL with /api from env var
const scholarshipApis = createSsoApiClients(apiClient);

interface SignInInput {
  email: string;
  password: string;
  productCode?: string;
  rememberMe?: boolean;
}

export const signIn = async (
  payload: SignInInput,
): Promise<LoginResponseDto> => {
  const request: LoginRequestDto = {
    email: payload.email,
    password: payload.password,
    productCode: payload.productCode,
  };
  const response = await scholarshipApis.authentication.authControllerLogin(
    request,
  );
  return response.data;
};

export const createPassword = async (payload: {
  token: string;
  password: string;
}) => {
  const request: CreatePasswordDto = {
    token: payload.token,
    password: payload.password,
  };
  const response =
    await scholarshipApis.authentication.authControllerCreatePassword(request);
  return response.data;
};

export const validateActivationToken = async (token: string) => {
  const response =
    await scholarshipApis.authentication.authControllerValidateActivationToken(
      token,
    );
  return response.data;
};

export const requestPasswordReset = async (
  email: string,
  returnUrl?: string,
  productCode?: string,
) => {
  // Note: Generated types are incomplete - backend accepts returnUrl and productCode
  const request = { email, returnUrl, productCode } as unknown as RequestPasswordResetDto;
  const response =
    await scholarshipApis.authentication.authControllerRequestPasswordReset(
      request,
    );
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const request: ResetPasswordDto = {
    token,
    newPassword,
  };
  const response =
    await scholarshipApis.authentication.authControllerResetPassword(request);
  return response.data;
};

export const checkEmail = async (email: string) => {
  const request: CheckEmailDto = { email };
  const response =
    await scholarshipApis.authentication.authControllerCheckEmail(request);
  return response.data;
};

export const resendActivation = async (email: string) => {
  const request: CheckEmailDto = { email };
  const response =
    await scholarshipApis.authentication.authControllerResendActivation(request);
  return response.data;
};

export const getMe = async (): Promise<GetMeResponseDto> => {
  const response = await scholarshipApis.authentication.authControllerGetMe();
  return response.data;
};

interface SignupInput {
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  phone?: string;
}

export const signup = async (payload: SignupInput) => {
  const response = await scholarshipApis.authentication.authControllerSignup(
    payload,
  );
  return response.data;
};
