import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { className, type, label, error, helpText, fullWidth = true, ...props },
  ref
) => {
  const inputClasses = clsx(
    'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
    'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-red-500 focus:ring-red-500',
    !fullWidth && 'w-auto',
    className
  );

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;