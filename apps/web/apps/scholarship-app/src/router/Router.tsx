import AdminSignInPage from '@/pages/auth/adminLogin.tsx';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthenticatedRedirect } from '../components/auth/AuthenticatedRedirect';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { ProcessLayout } from '../components/layout/ProcessLayout';
import { RouteGuard } from '../components/routing/RouteGuard';

// Lazy load pages with code splitting
const SignInPage = lazy(() => import('../pages/auth/SignIn.tsx'));
const CreatePasswordPage = lazy(() => import('../pages/auth/CreatePassword'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPassword'));
const AdminResetPasswordPage = lazy(() => import('../pages/auth/AdminResetPassword'));
const ChangePasswordPage = lazy(() => import('../pages/auth/ChangePassword'));
const ScholarshipChangePasswordPage = lazy(() => import('../pages/auth/ScholarshipChangePassword'));
const MfaVerifyPage = lazy(() => import('../pages/auth/MfaVerify'));
const RegistrationPage = lazy(() => import('../pages/registration/RegistrationForm'));
const VerificationPage = lazy(() => import('../pages/auth/Verification'));
const SetPasswordPage = lazy(() => import('../pages/auth/SetPassword'));
const EmailVerificationPage = lazy(() => import('../pages/auth/EmailVerification'));
const OAuthCallbackPage = lazy(() => import('../pages/auth/OAuthCallback'));
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
            <RouteGuard path="/user-login">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <SignInPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/admin-login"
          element={
            <RouteGuard path="/admin-login">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <AdminSignInPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/create-password"
          element={
            <RouteGuard path="/create-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <CreatePasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/registration"
          element={
            <RouteGuard path="/registration">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <RegistrationPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RouteGuard path="/forgot-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ForgotPasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/reset-password"
          element={
            <RouteGuard path="/reset-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ResetPasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/admin-reset-password"
          element={
            <RouteGuard path="/admin-reset-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <AdminResetPasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/change-password"
          element={
            <RouteGuard path="/change-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <ChangePasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/mfa/verify"
          element={
            <RouteGuard path="/mfa/verify">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <MfaVerifyPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/mfa-verify"
          element={
            <RouteGuard path="/mfa-verify">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <MfaVerifyPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />

        <Route
          path="/verification"
          element={
            <RouteGuard path="/verification">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <VerificationPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/set-password"
          element={
            <RouteGuard path="/set-password">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <SetPasswordPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/email-verification"
          element={
            <RouteGuard path="/email-verification">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <EmailVerificationPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/oauth-callback/:provider"
          element={
            <RouteGuard path="/oauth-callback/:provider">
              <Suspense fallback={<LoadingScreen message="Loading..." />}>
                <ErrorBoundary>
                  <OAuthCallbackPage />
                </ErrorBoundary>
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path="/process"
          element={
            <RouteGuard path="/process">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <ProcessPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <RouteGuard path="/reports">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <ReportsPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/role-management"
          element={
            <RouteGuard path="/role-management">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <RoleManagementPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/role-management/add"
          element={
            <RouteGuard path="/role-management/add">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <RoleFormPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/role-management/edit/:id"
          element={
            <RouteGuard path="/role-management/edit/:id">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <RoleFormPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/user-management"
          element={
            <RouteGuard path="/user-management">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <UserManagementPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/user-management/add"
          element={
            <RouteGuard path="/user-management/add">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <UserFormPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/user-management/edit/:id"
          element={
            <RouteGuard path="/user-management/edit/:id">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <UserFormPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/scholarship-change-password"
          element={
            <RouteGuard path="/scholarship-change-password">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <ScholarshipChangePasswordPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <RouteGuard path="/user-dashboard">
              <ProcessLayout hideSidebar={true}>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <UserDashboardPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RouteGuard path="/admin-dashboard">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <AdminDashboardPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/home"
          element={
            <RouteGuard path="/home">
              <ProcessLayout>
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  <ErrorBoundary>
                    <AdminDashboardPage />
                  </ErrorBoundary>
                </Suspense>
              </ProcessLayout>
            </RouteGuard>
          }
        />
        {/* Redirect authenticated users to registration */}
        <Route path="/*" element={<AuthenticatedRedirect />} />
      </Routes>
    </ErrorBoundary>
  );
};
