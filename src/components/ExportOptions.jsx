import { useState, useEffect } from 'react';

const ExportOptions = ({ onRegularExport, onSeedExport, onSaveSeedData, loading, disabled, stats }) => {
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    // Calculate estimated file size for seed data (includes templates)
    const estimatedSize = JSON.stringify({
      createdAt: new Date().toISOString(),
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        scholarships: Array(stats.scholarships).fill({}).map((_, i) => ({
          id: i + 1,
          name: 'Sample Scholarship',
          provider: 'Sample Provider',
          deadline: '2024-01-01',
          applicationYear: 2024,
          degreeLevel: 'Bachelor',
          country: 'Sample Country',
          status: 'Not Started',
          requiredDocumentIds: []
        })),
        checklistItems: Array(stats.checklistItems).fill({}).map((_, i) => ({
          id: i + 1,
          scholarshipId: 1,
          text: 'Sample Checklist Item',
          checked: false,
          order: i
        })),
        documents: Array(stats.documents).fill({}).map((_, i) => ({
          id: i + 1,
          name: 'Sample Document',
          type: 'Academic Transcript',
          status: 'NotReady',
          fileLink: '',
          notes: ''
        })),
        templates: Array(stats.templates).fill({}).map((_, i) => ({
          id: i + 1,
          name: 'Sample Template',
          description: 'Sample template description',
          category: 'General',
          country: '',
          items: [],
          createdBy: 'user',
          version: '1.0'
        }))
      }
    }).length;

    setFileSize(estimatedSize);
  }, [stats]);

  const handleRegularExport = async () => {
    if (disabled || loading) return;
    await onRegularExport();
  };

  const handleSeedExport = async () => {
    if (disabled || loading) return;
    await onSeedExport();
  };

  const handleSaveSeedData = async () => {
    if (disabled || loading) return;
    await onSaveSeedData();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Regular Data Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Regular Data Export
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Export your data for personal backup and portability. This includes scholarships, checklist items, and documents.
          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use this for personal backups, sharing with other users, or migrating data between devices.
          </span>
        </p>
        <button
          onClick={handleRegularExport}
          disabled={disabled || loading}
          className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm transition-colors ${
            disabled || loading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Regular Backup
            </>
          )}
        </button>

        {stats.totalItems > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-3 space-y-1">
            <div className="flex justify-between">
              <span>Estimated file size:</span>
              <span className="font-medium">{fileSize ? formatFileSize(fileSize * 0.8) : '...'}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Will include {stats.scholarships + stats.checklistItems + stats.documents} items (no templates)
            </div>
          </div>
        )}
      </div>

      {/* GitHub Pages Seed Data Export */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          GitHub Pages Seed Data
        </h4>
        <p className="text-blue-700 dark:text-blue-300 mb-4 text-sm">
          Export seed data for GitHub Pages deployment. This includes all data types (scholarships, checklist items, documents, and templates).
          <span className="block text-xs text-blue-600 dark:text-blue-400 mt-1">
            Use this to update the default data shown to new visitors on your GitHub Pages site.
          </span>
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleSeedExport}
            disabled={disabled || loading}
            className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-colors ${
              disabled || loading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Seed Data
              </>
            )}
          </button>
          <button
            onClick={handleSaveSeedData}
            disabled={disabled || loading}
            className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-colors ${
              disabled || loading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save to seedData.json
              </>
            )}
          </button>
        </div>

        {stats.totalItems > 0 && (
          <div className="text-sm text-blue-600 dark:text-blue-400 mt-3 space-y-1">
            <div className="flex justify-between">
              <span>Estimated file size:</span>
              <span className="font-medium">{fileSize ? formatFileSize(fileSize) : '...'}</span>
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-400">
              Will include {stats.totalItems} items (includes templates)
            </div>
          </div>
        )}

        <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-3 mt-4">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">How to update GitHub Pages data:</h5>
          <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>Click "Save to seedData.json" and download the file</li>
            <li>The export includes a <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">createdAt</code> timestamp that will trigger reimport for returning users</li>
            <li>Replace the content of <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">src/data/seedData.json</code> in your repository</li>
            <li>Commit and push the changes to GitHub</li>
            <li>GitHub Actions will automatically deploy the updated data</li>
          </ol>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Current Data Summary:</h5>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">{stats.scholarships} scholarships</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">{stats.checklistItems} checklist items</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">{stats.documents} documents</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">{stats.templates} templates</span>
          </div>
        </div>
      </div>

      {disabled && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Add some data first to enable export options
        </div>
      )}
    </div>
  );
};

export default ExportOptions;