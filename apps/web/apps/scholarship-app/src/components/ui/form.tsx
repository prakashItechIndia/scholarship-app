import * as React from 'react';
import { useFormContext, Controller, type FieldPath, type FieldValues } from 'react-hook-form';

// Form component - just passes through children
export const Form = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
  return <>{children}</>;
};

// FormField component - wraps Controller from react-hook-form
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  render,
}: {
  control?: any;
  name: TName;
  render: (props: { field: any; fieldState: any }) => React.ReactNode;
}) => {
  const formContext = useFormContext();
  const actualControl = control || formContext?.control;

  if (!actualControl) {
    console.warn('FormField: control is required');
    return null;
  }

  return (
    <Controller
      control={actualControl}
      name={name}
      render={({ field, fieldState }) => {
        // Make fieldState available via context for FormMessage
        return (
          <FormFieldContext.Provider value={fieldState}>
            {render({ field, fieldState })}
          </FormFieldContext.Provider>
        );
      }}
    />
  );
};

// Context to pass fieldState to FormMessage
const FormFieldContext = React.createContext<any>(null);

// FormMessage - displays error message
export const FormMessage = ({ 
  className,
  children,
  fieldState: propFieldState
}: { 
  className?: string;
  children?: React.ReactNode;
  fieldState?: { error?: { message?: string } };
}) => {
  const contextFieldState = React.useContext(FormFieldContext);
  const fieldState = propFieldState || contextFieldState;
  const errorMessage = fieldState?.error?.message || children;
  return errorMessage ? <div className={className}>{errorMessage}</div> : null;
};

// FormItem - just a wrapper div
export const FormItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

// FormControl - just passes through children
export const FormControl = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};


