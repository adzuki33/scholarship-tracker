import React, { useState, useEffect } from 'react';

const ScholarshipForm = ({ onSubmit, onCancel, editingScholarship }) => {
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    degreeLevel: 'Master',
    country: '',
    applicationYear: new Date().getFullYear(),
    deadline: '',
    status: 'Not Started',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingScholarship) {
      setFormData({
        name: editingScholarship.name,
        provider: editingScholarship.provider,
        degreeLevel: editingScholarship.degreeLevel,
        country: editingScholarship.country,
        applicationYear: editingScholarship.applicationYear,
        deadline: editingScholarship.deadline.split('T')[0],
        status: editingScholarship.status,
      });
    }
  }, [editingScholarship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'applicationYear' ? parseInt(value, 10) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Scholarship name is required';
    }

    if (!formData.provider.trim()) {
      newErrors.provider = 'Provider is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!formData.applicationYear || formData.applicationYear < 2000 || formData.applicationYear > 2100) {
      newErrors.applicationYear = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
    };

    onSubmit(submissionData);

    if (!editingScholarship) {
      setFormData({
        name: '',
        provider: '',
        degreeLevel: 'Master',
        country: '',
        applicationYear: new Date().getFullYear(),
        deadline: '',
        status: 'Not Started',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>{editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
      <form onSubmit={handleSubmit} className="scholarship-form">
        <div className="form-group">
          <label htmlFor="name">Scholarship Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="e.g., Fulbright Scholarship"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="provider">Provider *</label>
          <input
            type="text"
            id="provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className={errors.provider ? 'error' : ''}
            placeholder="e.g., U.S. Department of State"
          />
          {errors.provider && <span className="error-message">{errors.provider}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="degreeLevel">Degree Level *</label>
            <select
              id="degreeLevel"
              name="degreeLevel"
              value={formData.degreeLevel}
              onChange={handleChange}
            >
              <option value="Master">Master</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Not Started">Not Started</option>
              <option value="Preparing">Preparing</option>
              <option value="Submitted">Submitted</option>
              <option value="Interview">Interview</option>
              <option value="Result">Result</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={errors.country ? 'error' : ''}
            placeholder="e.g., United States"
          />
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applicationYear">Application Year *</label>
            <input
              type="number"
              id="applicationYear"
              name="applicationYear"
              value={formData.applicationYear}
              onChange={handleChange}
              className={errors.applicationYear ? 'error' : ''}
              min="2000"
              max="2100"
            />
            {errors.applicationYear && <span className="error-message">{errors.applicationYear}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline *</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={errors.deadline ? 'error' : ''}
            />
            {errors.deadline && <span className="error-message">{errors.deadline}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingScholarship ? 'Update Scholarship' : 'Add Scholarship'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScholarshipForm;
