// Single source of truth for status / outcome / document colors.
// Values are full Tailwind class strings (incl. dark variants) so the
// content scanner sees them literally — no safelist needed.

export const SCHOLARSHIP_STATUS_COLORS = {
  'Not Started': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  Preparing: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  Submitted: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  Interview: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  Result: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
};

export const DOCUMENT_STATUS_DOTS = {
  NotReady: 'bg-gray-400 dark:bg-gray-500',
  Draft: 'bg-yellow-500 dark:bg-yellow-600',
  Final: 'bg-blue-500 dark:bg-blue-400',
  Uploaded: 'bg-green-500 dark:bg-green-400',
};

export const OUTCOME_COLORS = {
  Accepted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  Waitlisted: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
  Rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
};

const NEUTRAL = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';

export const getStatusBadgeClass = (status) => SCHOLARSHIP_STATUS_COLORS[status] || NEUTRAL;
export const getDocumentDotClass = (status) => DOCUMENT_STATUS_DOTS[status] || DOCUMENT_STATUS_DOTS.NotReady;
export const getOutcomeBadgeClass = (outcome) => OUTCOME_COLORS[outcome] || NEUTRAL;
