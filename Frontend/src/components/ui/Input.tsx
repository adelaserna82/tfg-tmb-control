// components/ui/Input.tsx
import { Input as HeadlessInput } from '@headlessui/react';
import clsx from 'clsx';

interface InputProps {
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  description?: string;
}

function Input({
  className,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  error,
  description,
}: InputProps) {
  return (
    <div className="space-y-1">
      <HeadlessInput
      
        type={type}
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'w-full p-2 rounded-md border bg-gray- text-gray-900 dark:bg-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-green-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-700',
          className
        )}
      />
      {description && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export { Input };
