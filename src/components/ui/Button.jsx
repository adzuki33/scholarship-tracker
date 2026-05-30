import React from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS = {
  primary: 'text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600',
  secondary:
    'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
  danger:
    'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50',
  ghost:
    'text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
    {...rest}
  >
    {loading && <Spinner />}
    {children}
  </button>
);

export default Button;
