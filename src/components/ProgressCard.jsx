import React from 'react';
import { getUrgencyBgColor } from '../utils/stats';

const statusColors = {
  'Not Started': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  Preparing: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  Submitted: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  Interview: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  Result: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
};

const documentStatusDots = {
  NotReady: 'bg-gray-400 dark:bg-gray-500',
  Draft: 'bg-yellow-500 dark:bg-yellow-600',
  Final: 'bg-blue-500 dark:bg-blue-400',
  Uploaded: 'bg-green-500 dark:bg-green-400',
};

const completeDocumentStatuses = new Set(['Final', 'Uploaded']);

const ProgressCard = ({ scholarship, progress, documents = [], onViewChecklist }) => {
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

  const requiredDocumentIds = scholarship.requiredDocumentIds || [];
  const requiredDocumentStatuses = requiredDocumentIds.map((id) => {
    const doc = documents.find((d) => d.id === id);
    return {
      id,
      status: doc?.status || 'NotReady',
    };
  });

  const totalDocs = requiredDocumentIds.length;
  const readyDocs = requiredDocumentStatuses.filter((d) => completeDocumentStatuses.has(d.status)).length;
  const allDocsReady = totalDocs > 0 && readyDocs === totalDocs;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{scholarship.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{scholarship.provider}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[scholarship.status]}`}>
          {scholarship.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
          <span className="text-gray-600 dark:text-gray-300">
            {scholarship.degreeLevel} · {scholarship.country}
          </span>
        </div>

        <div className={`border rounded-lg p-3 ${getUrgencyBgColor(urgency)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">{formatDate(scholarship.deadline)}</span>
            </div>
            <span className="text-xs font-semibold">{getDaysText(daysUntilDeadline)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Application Progress</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              progress.percentage === 100
                ? 'bg-green-600 dark:bg-green-500'
                : progress.percentage >= 75
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : progress.percentage >= 50
                    ? 'bg-yellow-500 dark:bg-yellow-400'
                    : 'bg-orange-500 dark:bg-orange-400'
            }`}
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>
            {progress.completed} of {progress.total} requirements completed
          </span>
        </div>

        {totalDocs > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Documents</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  allDocsReady ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {allDocsReady ? 'All ready' : `${readyDocs}/${totalDocs} ready`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {requiredDocumentStatuses.map((doc) => (
                <span
                  key={doc.id}
                  className={`w-2.5 h-2.5 rounded-full ${
                    documentStatusDots[doc.status] || documentStatusDots.NotReady
                  }`}
                  title={doc.status}
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onViewChecklist(scholarship.id)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        View Detailed Checklist
      </button>
    </div>
  );
};

export default ProgressCard;
