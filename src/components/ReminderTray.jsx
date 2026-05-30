import React, { useState } from 'react';

const formatDaysText = (daysUntilDeadline, eventType) => {
  const isInterview = eventType === 'interview';
  if (daysUntilDeadline < 0) {
    return `${Math.abs(daysUntilDeadline)} day(s) overdue`;
  }
  if (daysUntilDeadline === 0) {
    return isInterview ? 'Interview today' : 'Due today';
  }
  if (daysUntilDeadline === 1) {
    return isInterview ? 'Interview tomorrow' : 'Due tomorrow';
  }
  return isInterview ? `Interview in ${daysUntilDeadline} day(s)` : `Due in ${daysUntilDeadline} day(s)`;
};

const PRESET_THRESHOLDS = [30, 14, 7, 3, 1, 0];

const ReminderTray = ({
  reminders,
  preferences,
  onToggleEnabled,
  onToggleQuietMode,
  onToggleThreshold,
  onAddThreshold,
  onEnableBrowserNotifications,
  onDismiss,
  onSnooze,
  onOpenScholarship,
}) => {
  const thresholds = preferences?.thresholds || [];
  const [customDay, setCustomDay] = useState('');

  const handleAddCustom = () => {
    const value = Number(customDay);
    if (Number.isFinite(value) && value >= 0 && onAddThreshold) {
      onAddThreshold(value);
      setCustomDay('');
    }
  };

  return (
    <section className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Deadline Reminders</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {preferences?.enabled
              ? preferences?.quietMode
                ? 'Quiet mode enabled. Alerts are paused.'
                : `${reminders.length} active reminder(s)`
              : 'Reminders are disabled.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleEnabled}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              preferences?.enabled
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            {preferences?.enabled ? 'Enabled' : 'Disabled'}
          </button>
          <button
            onClick={onToggleQuietMode}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              preferences?.quietMode
                ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Quiet Mode
          </button>
          <button
            onClick={onEnableBrowserNotifications}
            className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Browser Alerts
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Remind me this many days before a deadline:</p>
        <div className="flex flex-wrap items-center gap-2">
          {Array.from(new Set([...PRESET_THRESHOLDS, ...thresholds]))
            .sort((a, b) => b - a)
            .map((day) => {
              const selected = thresholds.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => onToggleThreshold(day)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    selected
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {day === 0 ? 'Day 0' : `${day}d`}
                </button>
              );
            })}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={customDay}
              onChange={(e) => setCustomDay(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              placeholder="days"
              className="w-16 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Custom reminder lead time in days"
            />
            <button
              onClick={handleAddCustom}
              className="px-2.5 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {reminders.length === 0 ? (
          <p className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">No active reminders right now.</p>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.key}
              className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <button
                onClick={() => onOpenScholarship(reminder.id)}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                  {reminder.eventType === 'interview' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                      🎤 Interview
                    </span>
                  )}
                  {reminder.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{reminder.provider || 'Unknown provider'}</p>
                <p className={`text-xs mt-0.5 ${reminder.eventType === 'interview' ? 'text-purple-600 dark:text-purple-300' : 'text-red-600 dark:text-red-300'}`}>
                  {formatDaysText(reminder.daysUntilDeadline, reminder.eventType)}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSnooze(reminder.key)}
                  className="px-2.5 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Snooze 24h
                </button>
                <button
                  onClick={() => onDismiss(reminder.key)}
                  className="px-2.5 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ReminderTray;