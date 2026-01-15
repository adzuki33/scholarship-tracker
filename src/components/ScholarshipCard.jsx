import React from 'react';

const ScholarshipCard = ({ scholarship, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Started': '#6c757d',
      'Preparing': '#0dcaf0',
      'Submitted': '#ffc107',
      'Interview': '#fd7e14',
      'Result': '#198754',
    };
    return colors[status] || '#6c757d';
  };

  const isDeadlineSoon = (deadlineString) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 30 && daysUntilDeadline >= 0;
  };

  const getDaysUntilDeadline = (deadlineString) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return `${Math.abs(daysUntilDeadline)} days overdue`;
    if (daysUntilDeadline === 0) return 'Due today';
    if (daysUntilDeadline === 1) return '1 day left';
    return `${daysUntilDeadline} days left`;
  };

  return (
    <div className="scholarship-card">
      <div className="card-header">
        <h3 className="card-title">{scholarship.name}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(scholarship.status) }}
        >
          {scholarship.status}
        </span>
      </div>

      <div className="card-body">
        <div className="card-info">
          <div className="info-row">
            <span className="info-label">Provider:</span>
            <span className="info-value">{scholarship.provider}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Degree Level:</span>
            <span className="info-value">{scholarship.degreeLevel}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Country:</span>
            <span className="info-value">{scholarship.country}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Application Year:</span>
            <span className="info-value">{scholarship.applicationYear}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Deadline:</span>
            <span className={`info-value ${isDeadlineSoon(scholarship.deadline) ? 'deadline-soon' : ''}`}>
              {formatDate(scholarship.deadline)}
              <span className="deadline-days"> ({getDaysUntilDeadline(scholarship.deadline)})</span>
            </span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn btn-edit"
          onClick={() => onEdit(scholarship)}
          aria-label="Edit scholarship"
        >
          Edit
        </button>
        <button
          className="btn btn-delete"
          onClick={() => onDelete(scholarship.id)}
          aria-label="Delete scholarship"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;
