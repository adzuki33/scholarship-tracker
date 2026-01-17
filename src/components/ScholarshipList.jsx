import React, { useState, useMemo, useCallback } from 'react';
import ScholarshipCard from './ScholarshipCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import MobileFilterDrawer from './MobileFilterDrawer';
import { searchScholarships } from '../utils/searchScholarships';
import { filterScholarships } from '../utils/filterScholarships';

const ScholarshipList = ({
  scholarships,
  onEdit,
  onDelete,
  onAddNew,
  onViewChecklist,
  checklistItemsByScholarship,
  documents = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Apply search and filters
  const filteredScholarships = useMemo(() => {
    let result = scholarships;

    // Apply search first
    result = searchScholarships(result, searchQuery);

    // Apply filters
    result = filterScholarships(result, filters);

    return result;
  }, [scholarships, searchQuery, filters]);

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Scholarships
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

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar query={searchQuery} onSearch={setSearchQuery} />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        scholarships={scholarships}
        filters={filters}
        onFilterChange={setFilters}
        filteredCount={filteredScholarships.length}
        totalCount={scholarships.length}
      />

      {/* Results count */}
      {searchQuery || Object.keys(filters).some(k => {
        const val = filters[k];
        return val && (Array.isArray(val) ? val.length > 0 : (val.type && val.type !== ''));
      }) ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {filteredScholarships.length} of {scholarships.length} scholarships
        </p>
      ) : null}

      {/* No results message */}
      {filteredScholarships.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scholarships match your filters</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({});
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
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
      )}
    </div>
  );
};

export default ScholarshipList;
