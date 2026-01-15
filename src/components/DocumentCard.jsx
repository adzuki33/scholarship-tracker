import React from 'react';

const DocumentCard = ({ document, onEdit, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    const baseClass = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'NotReady':
        return `${baseClass} bg-gray-100 text-gray-800`;
      case 'Draft':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'Final':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'Uploaded':
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      'CV': 'CV',
      'Transcript': 'Transcript',
      'LanguageCertificate': 'Language Certificate',
      'RecommendationLetter': 'Recommendation Letter',
      'LoA': 'Letter of Acceptance',
      'PersonalStatement': 'Personal Statement'
    };
    return typeLabels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {document.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {getTypeLabel(document.type)}
            </p>
          </div>
          <span className={getStatusBadgeClass(document.status)}>
            {document.status === 'NotReady' ? 'Not Ready' : 
             document.status === 'LanguageCertificate' ? document.status : 
             document.status}
          </span>
        </div>

        <div className="space-y-2">
          {document.fileLink && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <a 
                href={document.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                onClick={(e) => {
                  if (!document.fileLink.startsWith('http')) {
                    e.preventDefault();
                    return false;
                  }
                }}
              >
                {document.fileLink}
              </a>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {formatDate(document.lastUpdated)}
          </div>
        </div>

        {document.notes && (
          <div className="pt-2 mt-2 border-t border-gray-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-gray-900">Notes:</span> {document.notes}
            </p>
          </div>
        )}

        <div className="pt-2 mt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(document)}
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(document.id)}
              className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;