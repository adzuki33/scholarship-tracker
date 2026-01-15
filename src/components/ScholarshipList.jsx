import React from 'react';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipList = ({ scholarships, onEdit, onDelete, onAddNew }) => {
  const sortedScholarships = [...scholarships].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>My Scholarship Applications</h1>
        <button className="btn btn-primary" onClick={onAddNew}>
          + Add New Scholarship
        </button>
      </div>

      {sortedScholarships.length === 0 ? (
        <div className="empty-state">
          <h2>No Scholarships Yet</h2>
          <p>Start tracking your scholarship applications by adding your first one!</p>
          <button className="btn btn-primary" onClick={onAddNew}>
            + Add Your First Scholarship
          </button>
        </div>
      ) : (
        <div className="scholarships-grid">
          {sortedScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {sortedScholarships.length > 0 && (
        <div className="list-summary">
          <p>Total applications: {scholarships.length}</p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
