import React from 'react';

const TONES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-gray-800 dark:bg-gray-700 text-white',
};

const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed z-[60] bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm space-y-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        role="status"
        aria-live={t.type === 'error' ? 'assertive' : 'polite'}
        className={`toast-enter flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg ${TONES[t.type] || TONES.info}`}
      >
        <span className="flex-1 text-sm font-medium">{t.message}</span>
        <button
          type="button"
          onClick={() => onDismiss(t.id)}
          aria-label="Dismiss notification"
          className="opacity-80 hover:opacity-100 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ))}
  </div>
);

export default ToastContainer;
