import React from 'react';
import OverallStats from './OverallStats';
import ProgressCard from './ProgressCard';
import UpcomingDeadlines from './UpcomingDeadlines';
import { calculateScholarshipProgress, getUpcomingDeadlines, getOverallStats } from '../utils/stats';

const DashboardView = ({ 
  scholarships, 
  checklistItemsByScholarship, 
  documents,
  onViewChecklist,
  onAddScholarship 
}) => {
  const scholarshipsWithDeadlines = getUpcomingDeadlines(scholarships);
  const stats = getOverallStats(scholarships, checklistItemsByScholarship, documents);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your scholarship applications and progress</p>
        </div>
        {scholarships.length > 0 && (
          <button
            onClick={onAddScholarship}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Scholarship
          </button>
        )}
      </div>

      {scholarships.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Tracking Your Scholarships</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Begin your scholarship journey by adding your first application. Track deadlines, manage checklists, and organize documents all in one place.
          </p>
          <button
            onClick={onAddScholarship}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Your First Scholarship
          </button>
        </div>
      ) : (
        <>
          <OverallStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Your Scholarships</h3>
                <p className="text-sm text-gray-600 mt-1">Track progress and manage your applications</p>
              </div>
              {scholarshipsWithDeadlines.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600">No scholarships to display</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarshipsWithDeadlines.map(scholarship => {
                    const progress = calculateScholarshipProgress(scholarship.id, checklistItemsByScholarship);
                    return (
                      <ProgressCard
                        key={scholarship.id}
                        scholarship={scholarship}
                        progress={progress}
                        onViewChecklist={onViewChecklist}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Deadlines</h3>
                <p className="text-sm text-gray-600 mt-1">Sorted by urgency</p>
              </div>
              <UpcomingDeadlines 
                scholarships={scholarshipsWithDeadlines} 
                onViewScholarship={onViewChecklist}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;
