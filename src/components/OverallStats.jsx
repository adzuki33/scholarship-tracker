import React from 'react';

const statusColors = {
  'Not Started': 'bg-gray-100 text-gray-700 border-gray-200',
  'Preparing': 'bg-blue-100 text-blue-700 border-blue-200',
  'Submitted': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Interview': 'bg-purple-100 text-purple-700 border-purple-200',
  'Result': 'bg-green-100 text-green-700 border-green-200',
};

const OverallStats = ({ stats }) => {
  const { totalScholarships, byStatus, avgCompletion, overdueCount, documentStats } = stats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scholarships</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalScholarships}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{avgCompletion}%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${avgCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Deadlines</p>
              <p className={`text-3xl font-bold mt-2 ${overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {overdueCount}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${overdueCount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <svg className={`w-8 h-8 ${overdueCount > 0 ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents Ready</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {documentStats.ready}/{documentStats.total}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(byStatus).map(([status, count]) => (
            <div
              key={status}
              className={`border rounded-lg p-3 text-center ${statusColors[status]}`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-1">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
