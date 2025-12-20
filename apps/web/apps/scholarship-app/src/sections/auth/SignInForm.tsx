import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Label } from '@shared/components';

import { signIn } from '../../services/auth.service';

const schema = z.object({
  email: z.string().email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof schema>;

export const SignInForm = () => {
  const [searchParams] = useSearchParams();
  const passwordCreated = searchParams.get('passwordCreated') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: true },
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Data is already typed from zod schema

      // Store tokens in localStorage for Experience app to access
      if (data.accessToken) {
        localStorage.setItem('icaptur_access_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('icaptur_refresh_token', data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem('icaptur_user', JSON.stringify(data.user));
      }

      // Get redirect URL from query params or default to Experience app
const experienceAppUrl: string =
  (import.meta.env.VITE_EXPERIENCE_APP_URL as string | undefined) ?? '';
      const redirectUrl =
        searchParams.get('redirect') ?? `${experienceAppUrl}/dashboard`;

      // Redirect to Experience app
      window.location.href = redirectUrl;
    },
  });

  const onSubmit = (values: SignInFormData) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-8">
        Sign in to access intelligent resume processing, enhanced security, and
        seamless workflow automation.
      </p>

      {passwordCreated && (
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
          Password created successfully! Please sign in with your credentials.
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('rememberMe')}
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-600 mb-0 cursor-pointer">
            Remember me on this device
            </Label>
          </div>
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Forgot password?
          </a>
        </div>

        {mutation.isError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            Unable to sign in. Verify your credentials and try again.
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          disabled={mutation.status === 'pending'}
        >
          {mutation.status === 'pending' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <a href="#" className="text-blue-600 underline hover:text-blue-700">
            Contact Support
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-4">
          © 2024 iCaptur. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Powered by <span className="font-semibold">iTech</span>
        </p>
      </div>
    </div>
  );
};
