import React, { useState, useEffect } from 'react';
import { useServiceTypes } from '../../hooks/useServices';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import './ServiceForm.css';

const ServiceForm = ({ 
  service = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    type_id: '',
    image: null
  });

  const { serviceTypes, loading: typesLoading, error: typesError } = useServiceTypes();

  useEffect(() => {
    if (service) {
      setFormData({
        nom: service.nom || '',
        description: service.description || '',
        prix: service.prix || '',
        type_id: service.type_id || '',
        image: null
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  if (typesLoading) {
    return <Loading text="Chargement des types de services..." />;
  }

  if (typesError) {
    return <ErrorMessage error={typesError} />;
  }

  return (
    <div className="service-form-container">
      <h2>{service ? 'Modifier le service' : 'Nouveau service'}</h2>
      
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="nom">Nom du service *</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du service"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Décrivez le service"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prix">Prix (€)</label>
            <input
              type="number"
              id="prix"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00 (optionnel)"
            />
            <small className="form-help">
              Laissez vide si le prix est sur devis
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="type_id">Type de service *</label>
            <select
              id="type_id"
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un type</option>
              {serviceTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image du service</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          <small className="form-help">
            Formats acceptés: JPG, PNG, SVG (max 2MB)
          </small>
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
            {loading ? 'Enregistrement...' : (service ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
