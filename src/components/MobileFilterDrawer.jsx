import { useState, useEffect } from 'react';
import { filterScholarships } from '../utils/filterScholarships';

const MobileFilterDrawer = ({ 
  isOpen, 
  onClose, 
  scholarships, 
  onFilterChange, 
  currentFilters,
  className = ''
}) => {
  const [tempFilters, setTempFilters] = useState({
    status: [],
    country: [],
    startDate: null,
    endDate: null,
    ...currentFilters
  });

  useEffect(() => {
    if (isOpen) {
      setTempFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const availableCountries = [...new Set(scholarships.map(s => s.country).filter(Boolean))].sort();

  const handleStatusToggle = (status) => {
    setTempFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleCountryToggle = (country) => {
    setTempFilters(prev => ({
      ...prev,
      country: prev.country.includes(country)
        ? prev.country.filter(c => c !== country)
        : [...prev.country, country]
    }));
  };

  const handleApply = () => {
    onFilterChange(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      status: [],
      country: [],
      startDate: null,
      endDate: null
    };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-hidden">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          <button
            onClick={handleReset}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Reset All
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]"><div className="p-4 space-y-6">
            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status</h4>
              <div className="space-y-2">
                {['Not Started', 'Preparing', 'Submitted', 'Interview', 'Result'].map(status => (
                  <label key={status} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={tempFilters.status.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 dark:text-gray-100">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            {availableCountries.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Country</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {availableCountries.map(country => (
                    <label key={country} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={tempFilters.country.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div></div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-4 pb-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div></div></div></div>
  );
};

export default MobileFilterDrawer;