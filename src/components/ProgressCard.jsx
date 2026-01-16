import React from 'react';
import { getUrgencyBgColor } from '../utils/stats';

const statusColors = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'Preparing': 'bg-blue-100 text-blue-800',
  'Submitted': 'bg-yellow-100 text-yellow-800',
  'Interview': 'bg-purple-100 text-purple-800',
  'Result': 'bg-green-100 text-green-800',
};

const ProgressCard = ({ scholarship, progress, onViewChecklist }) => {
  const { daysUntilDeadline, urgency } = scholarship;
  
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
      return '1 day left';
    } else {
      return `${days} days left`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{scholarship.name}</h3>
          <p className="text-sm text-gray-600">{scholarship.provider}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[scholarship.status]}`}>
          {scholarship.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span className="text-gray-600">{scholarship.degreeLevel} · {scholarship.country}</span>
        </div>

        <div className={`border rounded-lg p-3 ${getUrgencyBgColor(urgency)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{formatDate(scholarship.deadline)}</span>
            </div>
            <span className="text-xs font-semibold">
              {getDaysText(daysUntilDeadline)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Application Progress</span>
          <span className="text-sm font-bold text-gray-900">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              progress.percentage === 100 ? 'bg-green-600' :
              progress.percentage >= 75 ? 'bg-blue-600' :
              progress.percentage >= 50 ? 'bg-yellow-500' :
              'bg-orange-500'
            }`}
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>
            {progress.completed} of {progress.total} requirements completed
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewChecklist(scholarship.id)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Detailed Checklist
      </button>
    </div>
  );
};

export default ProgressCard;
