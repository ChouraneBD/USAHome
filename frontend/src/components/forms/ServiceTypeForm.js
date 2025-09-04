import React, { useState } from 'react';
import './ServiceTypeForm.css';

const ServiceTypeForm = ({ serviceType, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: serviceType?.name || '',
    description: serviceType?.description || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du type de service est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="service-type-form-container">
      <div className="form-header">
        <h2>{serviceType ? 'Modifier le type de service' : 'Créer un nouveau type de service'}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="btn-close"
          disabled={loading}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="service-type-form">
        <div className="form-group">
          <label htmlFor="name">Nom du type de service *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Consultation, Développement, Maintenance..."
            className={errors.name ? 'error' : ''}
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Décrivez ce type de service..."
            disabled={loading}
          />
          <small className="form-help">Optionnel - Aide à comprendre le type de service</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : (serviceType ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceTypeForm;