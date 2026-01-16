import React, { useCallback } from 'react';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipList = ({
  scholarships,
  onEdit,
  onDelete,
  onAddNew,
  onViewChecklist,
  checklistItemsByScholarship,
  documents = [],
}) => {
  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      onDelete(id);
    }
  }, [onDelete]);

  if (scholarships.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scholarships yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first scholarship application.</p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          <svg className="ml-2 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add First Scholarship
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Scholarships ({scholarships.length})
        </h2>
        <button
          onClick={onAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Scholarship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onEdit={onEdit}
            onDelete={() => handleDelete(scholarship.id)}
            onViewChecklist={onViewChecklist}
            checklistItems={checklistItemsByScholarship?.[scholarship.id] || []}
            documents={documents}
          />
        ))}
      </div>
    </div>
  );
};

export default ScholarshipList;
