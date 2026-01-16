import React, { useMemo } from 'react';

const statusMeta = {
  NotReady: { label: 'Not Ready', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-800' },
  Draft: { label: 'Draft', dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  Final: { label: 'Final', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
  Uploaded: { label: 'Uploaded', dot: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
};

const completeStatuses = new Set(['Final', 'Uploaded']);

const getTypeLabel = (type) => {
  const labels = {
    CV: 'CV',
    Transcript: 'Transcript',
    LanguageCertificate: 'Language Certificate',
    RecommendationLetter: 'Recommendation Letter',
    LoA: 'Letter of Acceptance',
    PersonalStatement: 'Personal Statement',
  };
  return labels[type] || type;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const DocumentRequirements = ({ scholarship, documents = [], onViewDocument }) => {
  const requiredIds = scholarship?.requiredDocumentIds || [];

  const requiredDocuments = useMemo(() => {
    const byId = new Map(documents.map((d) => [d.id, d]));
    return requiredIds.map((id) => byId.get(id) || { id, name: `Missing document (#${id})`, type: 'Unknown', status: 'NotReady' });
  }, [documents, requiredIds]);

  const completedCount = requiredDocuments.filter((d) => completeStatuses.has(d.status)).length;
  const totalCount = requiredDocuments.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!scholarship) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track global document completion for this scholarship.
          </p>
        </div>
        {totalCount > 0 ? (
          <div className="text-right">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{completedCount}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalCount}</span> documents complete
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{percentage}%</p>
          </div>
        ) : (
          <span className="text-sm text-gray-600">No required documents</span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              percentage === 100 ? 'bg-green-600' : percentage >= 50 ? 'bg-blue-600' : 'bg-gray-400'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}

      {totalCount === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-700">No global documents have been marked as required for this scholarship.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requiredDocuments.map((doc) => {
            const meta = statusMeta[doc.status] || statusMeta.NotReady;
            return (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`}></span>
                      <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getTypeLabel(doc.type)} · Last updated: {formatDate(doc.lastUpdated)}
                    </p>
                    {doc.fileLink ? (
                      <a
                        href={doc.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline break-all mt-1 inline-block"
                        onClick={(e) => {
                          if (doc.fileLink && !doc.fileLink.startsWith('http')) {
                            e.preventDefault();
                            return false;
                          }
                        }}
                      >
                        {doc.fileLink}
                      </a>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${meta.badge}`}>
                      {meta.label}
                    </span>
                    {onViewDocument && documents.some((d) => d.id === doc.id) && (
                      <button
                        type="button"
                        onClick={() => onViewDocument(doc.id)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        View/Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentRequirements;
