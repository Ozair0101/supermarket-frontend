import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface FormProps<T extends z.ZodSchema> {
  form: UseFormReturn<z.infer<T>>;
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  children: React.ReactNode;
  className?: string;
}

const Form = <T extends z.ZodSchema>({
  form,
  onSubmit,
  children,
  className = '',
}: FormProps<T>) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  form: UseFormReturn<any>;
  className?: string;
}

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  form,
  className = '',
}: FormFieldProps) => {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`block w-full rounded-md border ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error.message as string}</p>
      )}
    </div>
  );
};

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  form: UseFormReturn<any>;
  className?: string;
}

const FormSelect = ({
  name,
  label,
  options,
  form,
  className = '',
}: FormSelectProps) => {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`block w-full rounded-md border ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error.message as string}</p>
      )}
    </div>
  );
};

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const FormButton = ({
  type = 'button',
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  onClick,
}: FormButtonProps) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Form, FormField, FormSelect, FormButton };