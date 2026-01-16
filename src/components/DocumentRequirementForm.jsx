import React, { useMemo } from 'react';

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

const DocumentRequirementForm = ({ documents = [], selectedIds = [], onChange }) => {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedDocuments = useMemo(() => {
    const selected = documents.filter((doc) => selectedSet.has(doc.id));
    return selected.sort((a, b) => a.name.localeCompare(b.name));
  }, [documents, selectedSet]);

  const toggleId = (id) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;

    const next = selectedSet.has(numericId)
      ? selectedIds.filter((existingId) => existingId !== numericId)
      : [...selectedIds, numericId];

    onChange(next);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select which global documents are required for this scholarship (optional).
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-gray-900">{selectedIds.length}</span>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-700">
            No documents available yet. Add documents in the <span className="font-medium">Documents</span> tab, then
            come back to select requirements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((doc) => (
              <label
                key={doc.id}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(doc.id)}
                  onChange={() => toggleId(doc.id)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-600">{getTypeLabel(doc.type)}</p>
                </div>
              </label>
            ))}
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Selected Preview</h4>
        {selectedDocuments.length === 0 ? (
          <p className="text-sm text-gray-600">No required documents selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDocuments.map((doc) => (
              <span
                key={doc.id}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {doc.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentRequirementForm;
