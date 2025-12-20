import { UseFormRegisterReturn } from 'react-hook-form';
import { Input, Label } from '@shared/components';
import { PersonRegular } from '@fluentui/react-icons';

interface EmailInputProps {
  id?: string;
  label?: string;
  register: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
}

export const EmailInput = ({
  id = 'email',
  label = 'Username',
  register,
  error,
  autoComplete = 'email',
  placeholder = '',
  defaultValue,
}: EmailInputProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-[4px]">
        <Label
          required
          htmlFor={id}
          className="text-[12px] font-normal text-[#242424] leading-[16px]"
        >
          {label}
        </Label>
        <Input
                    id={id}
                    type="email"
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
          errorMessage={error}
          prefixIcon={<PersonRegular style={{ width: '16px', height: '16px', color: '#616161' }} />}
                    {...register}
                  />
                </div>
    </div>
  );
};
