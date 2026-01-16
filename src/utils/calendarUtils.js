/**
 * Calendar utility functions for date handling and calendar operations
 */

/**
 * Get number of days in a month
 * @param {number} year - Full year (e.g., 2024)
 * @param {number} month - Month index (0-11)
 * @returns {number} Number of days in the month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the day of week for the first day of a month (0 = Sunday, 6 = Saturday)
 * @param {number} year - Full year
 * @param {number} month - Month index (0-11)
 * @returns {number} Day of week (0-6)
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

/**
 * Get the current date info
 * @returns {Object} Object with year, month, day
 */
export const getToday = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
};

/**
 * Format a date as ISO string (YYYY-MM-DD)
 * @param {Date} date - JavaScript Date object
 * @returns {string} ISO date string
 */
export const formatDateISO = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date info from ISO string
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {Object} Object with year, month, day
 */
export const getDateFromISO = (isoDate) => {
  const date = new Date(isoDate);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

/**
 * Check if a date is today
 * @param {number} year - Full year
 * @param {number} month - Month index (0-11)
 * @param {number} day - Day of month
 * @returns {boolean} True if the date is today
 */
export const isToday = (year, month, day) => {
  const today = getToday();
  return today.year === year && today.month === month && today.day === day;
};

/**
 * Check if a date is in the past (before today)
 * @param {number} year - Full year
 * @param {number} month - Month index (0-11)
 * @param {number} day - Day of month
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (year, month, day) => {
  const today = getToday();
  const date = new Date(year, month, day);
  const todayDate = new Date(today.year, today.month, today.day);
  return date < todayDate;
};

/**
 * Navigate to previous month
 * @param {number} year - Current year
 * @param {number} month - Current month (0-11)
 * @returns {Object} Object with new year and month
 */
export const getPreviousMonth = (year, month) => {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
};

/**
 * Navigate to next month
 * @param {number} year - Current year
 * @param {number} month - Current month (0-11)
 * @returns {Object} Object with new year and month
 */
export const getNextMonth = (year, month) => {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
};

/**
 * Navigate to a specific month and year
 * @param {number} year - Target year
 * @param {number} month - Target month (0-11)
 * @returns {Object} Object with year and month
 */
export const getMonthYear = (year, month) => {
  return { year, month };
};

/**
 * Generate calendar days for a month including padding days from prev/next months
 * @param {number} year - Full year
 * @param {number} month - Month index (0-11)
 * @returns {Array} Array of day objects with year, month, day, isCurrentMonth properties
 */
export const getCalendarDays = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const days = [];

  // Add padding days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      year: prevYear,
      month: prevMonth,
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPadding: true,
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      year,
      month,
      day,
      isCurrentMonth: true,
      isPadding: false,
    });
  }

  // Add padding days from next month to complete the grid (6 rows × 7 days = 42)
  const remainingDays = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      year: nextYear,
      month: nextMonth,
      day,
      isCurrentMonth: false,
      isPadding: true,
    });
  }

  return days;
};

/**
 * Get month name
 * @param {number} month - Month index (0-11)
 * @returns {string} Full month name
 */
export const getMonthName = (month) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month];
};

/**
 * Get short month name
 * @param {number} month - Month index (0-11)
 * @returns {string} Short month name (3 letters)
 */
export const getShortMonthName = (month) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return monthNames[month];
};

/**
 * Get short day name
 * @param {number} day - Day of week (0-6, Sunday = 0)
 * @returns {string} Short day name (3 letters)
 */
export const getShortDayName = (day) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[day];
};

/**
 * Calculate days until deadline from a given date
 * @param {string} deadline - Deadline date string
 * @param {Date} fromDate - Reference date (defaults to today)
 * @returns {number} Number of days until deadline
 */
export const getDaysUntilDeadline = (deadline, fromDate = new Date()) => {
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const refDate = new Date(fromDate);
  refDate.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate - refDate) / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date as short display (MMM D)
 * @param {string} dateString - Date string
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get hex color for urgency level (for calendar display)
 * @param {string} urgency - Urgency level: 'overdue', 'critical', 'high', 'medium', 'low'
 * @returns {string} Hex color code
 */
export const getCalendarUrgencyColor = (urgency) => {
  const colors = {
    overdue: '#ef4444',
    critical: '#f97316',
    high: '#eab308',
    medium: '#f59e0b',
    low: '#22c55e',
  };
  return colors[urgency] || '#9ca3af';
};
