import React, { useCallback } from 'react';
import { getDaysUntilDeadline, formatDateDisplay } from '../utils/calendarUtils';
import { getUrgencyLevel, getUrgencyBgColor } from '../utils/stats';

/**
 * CalendarDetail component - Modal or panel showing scholarships for a selected date
 * @param {Array} scholarships - Scholarships due on the selected date
 * @param {string|Object} selectedDate - Selected date info
 * @param {Function} onClose - Close handler
 * @param {Function} onViewChecklist - Handler to view scholarship checklist
 * @param {Function} onEdit - Handler to edit scholarship
 */
const CalendarDetail = ({
  scholarships,
  selectedDate,
  onClose,
  onViewChecklist,
  onEdit,
}) => {
  const formatDate = useCallback((dateInfo) => {
    if (typeof dateInfo === 'string') {
      return formatDateDisplay(dateInfo);
    }
    const date = new Date(dateInfo.year, dateInfo.month, dateInfo.day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  if (!selectedDate || scholarships.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Deadlines
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(selectedDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {scholarships.map((scholarship) => {
                const daysUntil = getDaysUntilDeadline(scholarship.deadline);
                const urgency = getUrgencyLevel(daysUntil);
                const urgencyClass = getUrgencyBgColor(urgency);

                return (
                  <div
                    key={scholarship.id}
                    className={`p-4 rounded-lg border ${urgencyClass}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {scholarship.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {scholarship.provider}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/50 dark:bg-black/30">
                        {scholarship.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span>{scholarship.country}</span>
                      <span>·</span>
                      <span>{scholarship.degreeLevel}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewChecklist(scholarship.id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      >
                        View Checklist
                      </button>
                      <button
                        onClick={() => onEdit(scholarship)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDetail;
