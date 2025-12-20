import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { IconButton } from '@fluentui/react';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';

import { createPassword } from '../../services/auth.service';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type CreatePasswordFormData = z.infer<typeof schema>;

export const CreatePasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: createPassword,
    onSuccess: () => {
      // Redirect to login or dashboard after successful password creation
      void navigate('/signin?passwordCreated=true');
    },
  });

  const onSubmit = (values: CreatePasswordFormData) => {
    if (!token) {
      // This should not happen if the route is accessed correctly
      // But handle it gracefully
      return;
    }
    mutation.mutate({
      token,
      password: values.password,
    });
  };

  if (!token) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-600 mb-8">
          This password creation link is invalid or has expired. Please request
          a new activation link.
        </p>
        <a
          href="/signin"
          className="inline-block rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Sign In
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Create Your Password
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome to iRepo! You're just one step away from accessing your
        dashboard. Please set a strong password to secure your account.
      </p>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        noValidate
      >
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register('password')}
            />
            <IconButton
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              ariaLabel={showPassword ? 'Hide password' : 'Show password'}
              onRenderIcon={() => 
                showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                  />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register('confirmPassword')}
            />
            <IconButton
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
              ariaLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
              onRenderIcon={() => 
                showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                  />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {mutation.isError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'Failed to create password. Please try again.'}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          disabled={mutation.status === 'pending' || !token}
        >
          {mutation.status === 'pending'
            ? 'Setting Password...'
            : 'Set Password & Continue'}
        </button>

        <p className="text-xs text-gray-600 text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-blue-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-blue-600">
            Privacy Policy
          </a>
          .
        </p>
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
