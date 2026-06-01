export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export const priorityToLabel = (priority) => {
  const n = Number(priority);
  if (!Number.isFinite(n) || n < 1) return 'Medium';
  if (n <= 2) return 'High';
  if (n === 3) return 'Medium';
  return 'Low';
};

export const labelToPriority = (label) => {
  if (label === 'High') return 1;
  if (label === 'Low') return 5;
  return 3; // Medium / unknown
};

export const PRIORITY_LABELS = ['High', 'Medium', 'Low'];

// Tailwind badge classes, consistent with existing dark-mode tokens in ChecklistItem
export const statusBadgeClass = (taskStatus) => {
  if (taskStatus === 'completed') return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
  if (taskStatus === 'in_progress') return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
  return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200';
};

export const priorityBadgeClass = (priority) => {
  const label = priorityToLabel(priority);
  if (label === 'High') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
  if (label === 'Low') return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200';
};

const isDone = (item) =>
  item.taskStatus ? item.taskStatus === 'completed' : Boolean(item.checked);

const pct = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

export const computeChecklistProgress = (items = []) => {
  const required = items.filter((i) => i.required === true);
  const requiredDone = required.filter(isDone).length;
  const overallDone = items.filter(isDone).length;
  return {
    requiredDone,
    requiredTotal: required.length,
    overallDone,
    overallTotal: items.length,
    requiredPercent: pct(requiredDone, required.length),
    overallPercent: pct(overallDone, items.length),
  };
};
