import AdminSignInPage from '@/pages/auth/adminLogin.tsx';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthenticatedRedirect } from '../components/auth/AuthenticatedRedirect';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { ProcessLayout } from '../components/layout/ProcessLayout';

// Lazy load pages with code splitting
const SignInPage = lazy(() => import('../pages/auth/SignIn.tsx'));
const CreatePasswordPage = lazy(() => import('../pages/auth/CreatePassword'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPassword'));
const ChangePasswordPage = lazy(() => import('../pages/auth/ChangePassword'));
const ScholarshipChangePasswordPage = lazy(() => import('../pages/auth/ScholarshipChangePassword'));
const MfaVerifyPage = lazy(() => import('../pages/auth/MfaVerify'));
const RegistrationPage = lazy(() => import('../pages/registration/RegistrationForm'));
const VerificationPage = lazy(() => import('../pages/auth/Verification'));
const SetPasswordPage = lazy(() => import('../pages/auth/SetPassword'));
const EmailVerificationPage = lazy(() => import('../pages/auth/EmailVerification'));
const ProcessPage = lazy(() => import('../pages/process'));

const UserDashboardPage = lazy(() => import('../pages/userDashboard'));
const AdminDashboardPage = lazy(() => import('../pages/adminDashboard/AdminDashboard.tsx'));
const ReportsPage = lazy(() => import('../pages/reports'));
const RoleManagementPage = lazy(() => import('../pages/roleManagement'));
const RoleFormPage = lazy(() => import('../pages/roleManagement/components/RoleForm'));
const UserManagementPage = lazy(() => import('../pages/userManagement'));
const UserFormPage = lazy(() => import('../pages/userManagement/components/UserForm'));

export const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/user-login"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <SignInPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/admin-login"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <AdminSignInPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/create-password"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <CreatePasswordPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/registration"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <RegistrationPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ForgotPasswordPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ResetPasswordPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/change-password"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ChangePasswordPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/mfa/verify"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <MfaVerifyPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/mfa-verify"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <MfaVerifyPage />
              </ErrorBoundary>
            </Suspense>
          }
        />

        <Route
          path="/verification"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <VerificationPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/set-password"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <SetPasswordPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/email-verification"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <EmailVerificationPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/process"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ProcessPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ReportsPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/role-management"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <RoleManagementPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/role-management/add"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <RoleFormPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/role-management/edit/:id"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <RoleFormPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <UserManagementPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/user-management/add"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <UserFormPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/user-management/edit/:id"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <UserFormPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/scholarship-change-password"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ScholarshipChangePasswordPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProcessLayout hideSidebar={true}>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <UserDashboardPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        <Route
          path="/home"
          element={
            <ProcessLayout>
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              </Suspense>
            </ProcessLayout>
          }
        />
        {/* Redirect authenticated users to registration */}
        <Route path="/*" element={<AuthenticatedRedirect />} />
      </Routes>
    </ErrorBoundary>
  );
};
