import React from 'react';

const Field = ({ id, label, error, required = false, children }) => {
  const describedBy = error ? `${id}-error` : undefined;
  const child = React.Children.only(children);
  const input = React.cloneElement(child, {
    id,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
  });

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}{' '}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      {input}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
