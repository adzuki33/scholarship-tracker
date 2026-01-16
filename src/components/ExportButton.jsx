import { useState, useEffect } from 'react';

const ExportButton = ({ onExport, loading, disabled, stats }) => {
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    // Calculate estimated file size
    const estimatedSize = JSON.stringify({
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
        }))
      }
    }).length;

    setFileSize(estimatedSize);
  }, [stats]);

  const handleClick = async () => {
    if (disabled || loading) return;
    await onExport();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
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
            Export All Data
          </>
        )}
      </button>

      {stats.totalItems === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No data to export
        </p>
      )}

      {stats.totalItems > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <div className="flex justify-between">
            <span>Estimated file size:</span>
            <span className="font-medium">{fileSize ? formatFileSize(fileSize) : '...'}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Will include {stats.totalItems} total items
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">What will be exported:</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            {stats.scholarships} scholarships
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {stats.checklistItems} checklist items
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            {stats.documents} documents
          </li>
        </ul>
      </div>

      {disabled && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Add some data first to enable export
        </div>
      )}
    </div>
  );
};

export default ExportButton;