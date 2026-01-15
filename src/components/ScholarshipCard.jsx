import React from 'react';

const statusColors = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'Preparing': 'bg-blue-100 text-blue-800',
  'Submitted': 'bg-yellow-100 text-yellow-800',
  'Interview': 'bg-purple-100 text-purple-800',
  'Result': 'bg-green-100 text-green-800',
};

const ScholarshipCard = ({ scholarship, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const deadline = new Date(scholarship.deadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  const deadlineClass = daysUntilDeadline < 7 ? 'text-red-600 font-semibold' : 
                       daysUntilDeadline < 30 ? 'text-yellow-600 font-semibold' : 
                       'text-gray-600';

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
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={deadlineClass}>Deadline: {formatDate(scholarship.deadline)}</span>
          {daysUntilDeadline < 0 && <span className="ml-2 text-red-600 text-xs">(Passed)</span>}
          {daysUntilDeadline >= 0 && daysUntilDeadline < 30 && (
            <span className="ml-2 text-gray-500 text-xs">({daysUntilDeadline} days)</span>
          )}
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-gray-600">{scholarship.applicationYear}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(scholarship)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(scholarship.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;
