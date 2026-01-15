import React, { useState, useEffect, useCallback } from 'react';
import ScholarshipList from './components/ScholarshipList';
import ScholarshipForm from './components/ScholarshipForm';
import {
  initDB,
  createScholarship,
  getAllScholarships,
  updateScholarship,
  deleteScholarship,
} from './db/indexeddb';
import './App.css';

function App() {
  const [scholarships, setScholarships] = useState([]);
  const [view, setView] = useState('list');
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        const data = await getAllScholarships();
        setScholarships(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to load scholarships. Please refresh the page.');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleAddScholarship = useCallback(async (data) => {
    try {
      const newScholarship = await createScholarship(data);
      setScholarships((prev) => [...prev, newScholarship]);
      setView('list');
      setEditingScholarship(null);
    } catch (err) {
      console.error('Failed to create scholarship:', err);
      alert('Failed to add scholarship. Please try again.');
    }
  }, []);

  const handleUpdateScholarship = useCallback(async (data) => {
    try {
      const updated = await updateScholarship(editingScholarship.id, data);
      setScholarships((prev) =>
        prev.map((s) => (s.id === editingScholarship.id ? updated : s))
      );
      setView('list');
      setEditingScholarship(null);
    } catch (err) {
      console.error('Failed to update scholarship:', err);
      alert('Failed to update scholarship. Please try again.');
    }
  }, [editingScholarship]);

  const handleDeleteScholarship = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    try {
      await deleteScholarship(id);
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete scholarship:', err);
      alert('Failed to delete scholarship. Please try again.');
    }
  }, []);

  const handleEditScholarship = useCallback((scholarship) => {
    setEditingScholarship(scholarship);
    setView('form');
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingScholarship(null);
    setView('form');
  }, []);

  const handleCancel = useCallback(() => {
    setEditingScholarship(null);
    setView('list');
  }, []);

  const handleSubmit = useCallback(
    (data) => {
      if (editingScholarship) {
        handleUpdateScholarship(data);
      } else {
        handleAddScholarship(data);
      }
    },
    [editingScholarship, handleAddScholarship, handleUpdateScholarship]
  );

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <p>Loading scholarships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="main-content">
        {view === 'list' ? (
          <ScholarshipList
            scholarships={scholarships}
            onEdit={handleEditScholarship}
            onDelete={handleDeleteScholarship}
            onAddNew={handleAddNew}
          />
        ) : (
          <ScholarshipForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingScholarship={editingScholarship}
          />
        )}
      </main>
    </div>
  );
}

export default App;
