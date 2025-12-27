import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input, Label } from '@shared/components';
import { useToast } from '@/components/ui/toast';
import { scholarshipAuth } from '@/services/scholarship.service';

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

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
  username,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

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
      onOpenChange(false);
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

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Change Password"
      size="md"
    >
      <div style={{ padding: '8px 0' }}>
        <p style={{ 
          marginBottom: '24px', 
          color: '#242424', 
          fontSize: '14px',
          lineHeight: "20px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Welcome Mr/Miss: <strong>{username}</strong>
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Current Password */}
          <div>
            <Label 
              htmlFor="currentPassword" 
              required
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Current Password 
            </Label>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...form.register('currentPassword')}
              placeholder="Enter current password"
              style={{ 
                width: "100%",
                height: "32px",
                marginTop: "0px",
              }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ 
                    minWidth: 'auto', 
                    padding: '4px 8px',
                    height: "32px",
                    fontSize: "14px",
                  }}
                >
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.currentPassword && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label 
              htmlFor="newPassword" 
              required
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              New Password 
            </Label>
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...form.register('newPassword')}
              placeholder="Enter new password"
              style={{ 
                width: "100%",
                height: "32px",
                marginTop: "0px",
              }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ 
                    minWidth: 'auto', 
                    padding: '4px 8px',
                    height: "32px",
                    fontSize: "14px",
                  }}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.newPassword && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label 
              htmlFor="confirmPassword" 
              required
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Confirm Password 
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...form.register('confirmPassword')}
              placeholder="Confirm new password"
              style={{ 
                width: "100%",
                height: "32px",
                marginTop: "0px",
              }}
              contentAfter={
                <Button
                  appearance="subtle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ 
                    minWidth: 'auto', 
                    padding: '4px 8px',
                    height: "32px",
                    fontSize: "14px",
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {form.formState.errors.confirmPassword && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end', 
            marginTop: '8px',
            paddingTop: '8px',
          }}>
            <Button
              type="button"
              appearance="secondary"
              onClick={handleClose}
              disabled={mutation.isPending}
              style={{
                height: "32px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                borderRadius: "6px",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              appearance="primary"
              disabled={mutation.isPending}
              style={{
                height: "32px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                borderRadius: "6px",
                backgroundColor: "#0f6cbd",
              }}
            >
              {mutation.isPending ? 'Changing...' : 'Change'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

