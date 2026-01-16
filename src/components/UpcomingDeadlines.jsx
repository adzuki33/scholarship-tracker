import React from 'react';
import { getUrgencyColor, getUrgencyBgColor } from '../utils/stats';

const UpcomingDeadlines = ({ scholarships, onViewScholarship }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysText = (days) => {
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else {
      return `${days} days`;
    }
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      overdue: 'Overdue',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    };
    return labels[urgency] || labels.low;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        <span className="text-sm text-gray-500">{scholarships.length} total</span>
      </div>

      {scholarships.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-600">No scholarships yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {scholarships.map(scholarship => (
            <div
              key={scholarship.id}
              onClick={() => onViewScholarship(scholarship.id)}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${getUrgencyBgColor(scholarship.urgency)}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewScholarship(scholarship.id);
                }
              }}
              aria-label={`View ${scholarship.name}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{scholarship.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{scholarship.provider}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold">
                    {getUrgencyLabel(scholarship.urgency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(scholarship.deadline)}</span>
                </div>
                <span className="font-bold text-sm">
                  {getDaysText(scholarship.daysUntilDeadline)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines;
