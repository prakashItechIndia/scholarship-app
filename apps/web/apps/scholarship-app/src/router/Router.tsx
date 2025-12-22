import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { AuthenticatedRedirect } from '../components/auth/AuthenticatedRedirect';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ProcessLayout } from '../components/layout/ProcessLayout';

// Lazy load pages with code splitting
const SignInPage = lazy(() => import('../pages/auth/SignIn.tsx'));
const CreatePasswordPage = lazy(() => import('../pages/auth/CreatePassword'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPassword'));
const ChangePasswordPage = lazy(() => import('../pages/auth/ChangePassword'));
const MfaVerifyPage = lazy(() => import('../pages/auth/MfaVerify'));
const RegistrationPage = lazy(() => import('../pages/registration/RegistrationForm'));
const VerificationPage = lazy(() => import('../pages/auth/Verification'));
const SetPasswordPage = lazy(() => import('../pages/auth/SetPassword'));
const ProcessPage = lazy(() => import('../pages/process'));
const LandingPage = lazy(() => import('../pages/Landing'));
const UserDashboardPage = lazy(() => import('../pages/userDashboard'));
const AdminDashboardPage = lazy(() => import('../pages/adminDashboard/AdminDashboard'));

export const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/signin"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <SignInPage />
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
          path="/landing"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            </Suspense>
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
