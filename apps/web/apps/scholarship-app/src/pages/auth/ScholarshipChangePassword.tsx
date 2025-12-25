import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ProcessLayout } from '@/components/layout/ProcessLayout';
import { useToast } from '@/components/ui/toast';
import { scholarshipAuth } from '@/services/scholarship.service';
import { Button, Input, Label } from '@fluentui/react-components';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password must match new password",
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof schema>;

const ScholarshipChangePasswordPage = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

  // Get username from localStorage (scholarship_auth)
  const getUsername = (): string | null => {
    try {
      const authData = localStorage.getItem('scholarship_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.username || parsed.User_ID || null;
      }
    } catch (e) {
      console.error('Error reading username from storage:', e);
    }
    return null;
  };

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const username = getUsername();
      if (!username) {
        throw new Error('User not found. Please login again.');
      }
      return scholarshipAuth.changePassword(
        username,
        data.currentPassword,
        data.newPassword,
      );
    },
    onSuccess: () => {
      success('Success', 'Password has been changed successfully.');
      form.reset();
      // Redirect to dashboard or previous page after a short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    },
    onError: (err: Error) => {
      error(
        'Change Password Failed',
        err.message || 'Unable to change password. Please try again.',
      );
    },
  });

  const onSubmit = (values: ChangePasswordFormData) => {
    mutation.mutate(values);
  };

  const username = getUsername();

  if (!username) {
    return (
      <ProcessLayout>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>User not found. Please login again.</p>
          <Button onClick={() => navigate('/admin-login')}>Go to Login</Button>
        </div>
      </ProcessLayout>
    );
  }

  return (
    <ProcessLayout>
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Change Password
        </h2>
        <p style={{ marginBottom: '24px', color: '#616161' }}>
          Welcome Mr/Miss: {username}
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword" required>
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...form.register('currentPassword')}
              placeholder="Enter current password"
              style={{ marginTop: '8px' }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ minWidth: 'auto', padding: '4px 8px' }}
                >
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.currentPassword && (
              <p style={{ color: '#d13438', fontSize: '12px', marginTop: '4px' }}>
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" required>
              New Password
            </Label>
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...form.register('newPassword')}
              placeholder="Enter new password"
              style={{ marginTop: '8px' }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ minWidth: 'auto', padding: '4px 8px' }}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.newPassword && (
              <p style={{ color: '#d13438', fontSize: '12px', marginTop: '4px' }}>
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...form.register('confirmPassword')}
              placeholder="Confirm new password"
              style={{ marginTop: '8px' }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ minWidth: 'auto', padding: '4px 8px' }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.confirmPassword && (
              <p style={{ color: '#d13438', fontSize: '12px', marginTop: '4px' }}>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button
              type="submit"
              appearance="primary"
              disabled={mutation.isPending}
              style={{ minWidth: '120px' }}
            >
              {mutation.isPending ? 'Changing...' : 'Change'}
            </Button>
            <Button
              type="button"
              appearance="secondary"
              onClick={() => navigate('/admin-dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ProcessLayout>
  );
};

export default ScholarshipChangePasswordPage;

