import { UseFormRegisterReturn } from 'react-hook-form';

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
        <label
          className="text-[12px] font-normal text-[#242424] leading-[16px] flex items-end gap-[4px]"
          htmlFor={id}
        >
          <span>{label}</span>
          <span className="text-[12px] text-[#b10e1c]">*</span>
        </label>
        <div className="relative">
          <div
            className={`w-full rounded-[4px] border ${
              error ? 'border-red-300' : 'border-[#d1d1d1]'
            } bg-white`}
          >
            <div className="flex items-center gap-[10px] px-[10px] py-0 rounded-[inherit]">
              <div className="flex flex-1 items-center min-h-px min-w-px">
                {/* User icon */}
                <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                  <svg
                    width="10"
                    height="12.5"
                    viewBox="0 0 10 12.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 6.25C6.38071 6.25 7.5 5.13071 7.5 3.75C7.5 2.36929 6.38071 1.25 5 1.25C3.61929 1.25 2.5 2.36929 2.5 3.75C2.5 5.13071 3.61929 6.25 5 6.25Z"
                      fill="#616161"
                    />
                    <path
                      d="M5 7.5C2.92893 7.5 1.25 9.17893 1.25 11.25V12.5H8.75V11.25C8.75 9.17893 7.07107 7.5 5 7.5Z"
                      fill="#616161"
                    />
                  </svg>
                </div>
                {/* Input field */}
                <div className="flex flex-1 items-start min-h-px min-w-px overflow-hidden pb-[7px] pt-[5px] px-[2px]">
                  <input
                    id={id}
                    type="email"
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className="w-full text-[13px] leading-[20px] text-[#242424] bg-transparent border-none outline-none placeholder:text-[#707070]"
                    {...register}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
