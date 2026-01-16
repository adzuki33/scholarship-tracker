import React, { useState, useEffect } from 'react';
import { getBuiltInTemplates } from '../data/templates';
import { getUserTemplates, deleteTemplate } from '../db/indexeddb';
import CustomTemplateForm from './CustomTemplateForm';
import TemplatePreview from './TemplatePreview';

const TemplateManager = ({ onTemplateUpdate }) => {
  const [builtInTemplates, setBuiltInTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [view, setView] = useState('list');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const builtIn = getBuiltInTemplates();
      const userDefined = await getUserTemplates();
      setBuiltInTemplates(builtIn);
      setUserTemplates(userDefined);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setView('form');
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        await deleteTemplate(templateId);
        await loadTemplates();
        if (onTemplateUpdate) {
          onTemplateUpdate();
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template: ' + error.message);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingTemplate) {
        const { updateTemplate } = await import('../db/indexeddb');
        await updateTemplate(editingTemplate.id, data);
      } else {
        const { createTemplate } = await import('../db/indexeddb');
        await createTemplate(data);
      }
      await loadTemplates();
      setView('list');
      setEditingTemplate(null);
      if (onTemplateUpdate) {
        onTemplateUpdate();
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template: ' + error.message);
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingTemplate(null);
    setPreviewTemplate(null);
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setView('form');
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading templates...</p>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <CustomTemplateForm
        template={editingTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Template Manager
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your custom templates and view built-in templates
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          >
            + Create Template
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Custom Templates ({userTemplates.length})
            </h3>
            {userTemplates.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No custom templates yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                        Custom
                      </span>
                    </div>
                    {template.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      {template.category && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {template.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • {template.items?.length || 0} items
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="flex-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded font-medium transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="flex-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Built-in Templates ({builtInTemplates.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {builtInTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      Built-in
                    </span>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {template.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {template.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {template.items?.length || 0} items
                    </span>
                  </div>
                  <button
                    onClick={() => handlePreview(template)}
                    className="w-full px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded font-medium transition-colors"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Template Preview
              </h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <TemplatePreview template={previewTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
