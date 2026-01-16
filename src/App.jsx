import { useState, useEffect, useCallback } from 'react';
import DashboardView from './components/DashboardView';
import ScholarshipList from './components/ScholarshipList';
import ScholarshipForm from './components/ScholarshipForm';
import ChecklistView from './components/ChecklistView';
import DocumentTracker from './components/DocumentTracker';
import { getAllScholarships, createScholarship, updateScholarship, deleteScholarship, getChecklistItems, createChecklistItem, updateChecklistItem, deleteChecklistItem, reorderChecklistItems, getAllDocuments } from './db/indexeddb';

function App() {
  const [scholarships, setScholarships] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentTrackerEditId, setDocumentTrackerEditId] = useState(null);
  const [view, setView] = useState('dashboard');
  const [mainTab, setMainTab] = useState('dashboard'); // 'dashboard', 'scholarships' or 'documents'
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [currentChecklistScholarship, setCurrentChecklistScholarship] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);
  const [checklistItemsByScholarship, setChecklistItemsByScholarship] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
    loadAllChecklistItems();
    loadDocuments();
  }, []);

  const loadAllChecklistItems = async () => {
    try {
      const itemsMap = {};
      for (const scholarship of scholarships) {
        const items = await getChecklistItems(scholarship.id);
        itemsMap[scholarship.id] = items;
      }
      setChecklistItemsByScholarship(itemsMap);
    } catch (error) {
      console.error('Error loading checklist items:', error);
    }
  };

  useEffect(() => {
    if (scholarships.length > 0) {
      loadAllChecklistItems();
    }
  }, [scholarships]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      const data = await getAllScholarships();
      const sorted = data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setScholarships(sorted);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleCreateScholarship = useCallback(async (data) => {
    try {
      await createScholarship(data);
      await loadScholarships();
      setView('list');
    } catch (error) {
      console.error('Error creating scholarship:', error);
    }
  }, []);

  const handleUpdateScholarship = useCallback(async (data) => {
    try {
      await updateScholarship(editingScholarship.id, data);
      await loadScholarships();
      setView('list');
      setEditingScholarship(null);
    } catch (error) {
      console.error('Error updating scholarship:', error);
    }
  }, [editingScholarship]);

  const handleDeleteScholarship = useCallback(async (id) => {
    try {
      await deleteScholarship(id);
      await loadScholarships();
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    }
  }, []);

  const handleEdit = useCallback((scholarship) => {
    setEditingScholarship(scholarship);
    setView('form');
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingScholarship(null);
    setMainTab('scholarships');
    setView('form');
  }, []);

  const handleCancel = useCallback(() => {
    if (view === 'checklist') {
      setView('list');
    }
    setEditingScholarship(null);
    setCurrentChecklistScholarship(null);
    setChecklistItems([]);
  }, [view]);

  const handleViewChecklist = useCallback(async (scholarshipId) => {
    const scholarship = scholarships.find(s => s.id === scholarshipId);
    if (scholarship) {
      setCurrentChecklistScholarship(scholarship);
      setMainTab('scholarships');
      setView('checklist');
      try {
        const items = await getChecklistItems(scholarshipId);
        setChecklistItems(items);
      } catch (error) {
        console.error('Error loading checklist items:', error);
        setChecklistItems([]);
      }
    }
  }, [scholarships]);

  const handleViewDocument = useCallback((documentId) => {
    setDocumentTrackerEditId(documentId);
    setMainTab('documents');
    setView('list');
    setEditingScholarship(null);
    setCurrentChecklistScholarship(null);
    setChecklistItems([]);
  }, []);

  const clearDocumentTrackerEditId = useCallback(() => {
    setDocumentTrackerEditId(null);
  }, []);

  const handleCreateChecklistItem = useCallback(async (data) => {
    if (!currentChecklistScholarship) return;
    try {
      await createChecklistItem(currentChecklistScholarship.id, data);
      const items = await getChecklistItems(currentChecklistScholarship.id);
      setChecklistItems(items);
      await loadAllChecklistItems();
    } catch (error) {
      console.error('Error creating checklist item:', error);
    }
  }, [currentChecklistScholarship, loadAllChecklistItems]);

  const handleUpdateChecklistItem = useCallback(async (id, data) => {
    try {
      await updateChecklistItem(id, data);
      if (currentChecklistScholarship) {
        const items = await getChecklistItems(currentChecklistScholarship.id);
        setChecklistItems(items);
      }
      await loadAllChecklistItems();
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  }, [currentChecklistScholarship, loadAllChecklistItems]);

  const handleDeleteChecklistItem = useCallback(async (id) => {
    try {
      await deleteChecklistItem(id);
      if (currentChecklistScholarship) {
        const items = await getChecklistItems(currentChecklistScholarship.id);
        setChecklistItems(items);
      }
      await loadAllChecklistItems();
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  }, [currentChecklistScholarship, loadAllChecklistItems]);

  const handleReorderChecklistItems = useCallback(async (items) => {
    if (!currentChecklistScholarship) return;
    try {
      await reorderChecklistItems(currentChecklistScholarship.id, items);
      setChecklistItems(items);
      await loadAllChecklistItems();
    } catch (error) {
      console.error('Error reordering checklist items:', error);
    }
  }, [currentChecklistScholarship, loadAllChecklistItems]);

  const handleSave = useCallback((data) => {
    if (editingScholarship) {
      handleUpdateScholarship(data);
    } else {
      handleCreateScholarship(data);
    }
  }, [editingScholarship, handleCreateScholarship, handleUpdateScholarship]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Tracker</h1>
            </div>
            {mainTab === 'scholarships' && view === 'form' && (
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to List
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-1 border-t border-gray-200">
            <button
              onClick={() => {
                setMainTab('dashboard');
                setView('dashboard');
                handleCancel();
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                mainTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setMainTab('scholarships');
                setView('list');
                handleCancel();
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                mainTab === 'scholarships'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Scholarships
            </button>
            <button
              onClick={() => {
                setMainTab('documents');
                clearDocumentTrackerEditId();
                handleCancel();
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                mainTab === 'documents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mainTab === 'dashboard' ? (
          <DashboardView
            scholarships={scholarships}
            checklistItemsByScholarship={checklistItemsByScholarship}
            documents={documents}
            onViewChecklist={handleViewChecklist}
            onAddScholarship={handleAddNew}
          />
        ) : mainTab === 'scholarships' ? (
          view === 'list' ? (
            <ScholarshipList
              scholarships={scholarships}
              onEdit={handleEdit}
              onDelete={handleDeleteScholarship}
              onAddNew={handleAddNew}
              onViewChecklist={handleViewChecklist}
              checklistItemsByScholarship={checklistItemsByScholarship}
              documents={documents}
            />
          ) : view === 'checklist' ? (
            <ChecklistView
              scholarship={currentChecklistScholarship}
              onBack={handleCancel}
              checklistItems={checklistItems}
              onCreateItem={handleCreateChecklistItem}
              onUpdateItem={handleUpdateChecklistItem}
              onDeleteItem={handleDeleteChecklistItem}
              onReorderItems={handleReorderChecklistItems}
              documents={documents}
              onViewDocument={handleViewDocument}
            />
          ) : (
            <ScholarshipForm
              scholarship={editingScholarship}
              documents={documents}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )
        ) : (
          <DocumentTracker
            scholarships={scholarships}
            onViewScholarship={handleViewChecklist}
            initialEditDocumentId={documentTrackerEditId}
            onClearInitialEdit={clearDocumentTrackerEditId}
            onDocumentsChanged={loadDocuments}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Scholarship Tracker · Data stored locally with IndexedDB
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
