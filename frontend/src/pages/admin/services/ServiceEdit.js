import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useServices, useServiceTypes } from '../../../hooks/useServices';
import ServiceService from '../../../services/serviceService';
import './ServiceForm.css';

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateService } = useServices();
  const { serviceTypes, loading: typesLoading, error: typesError } = useServiceTypes();
  
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    type_id: '',
    image: null
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await ServiceService.getServiceById(id);
        setService(serviceData);
        setFormData({
          nom: serviceData.nom || '',
          description: serviceData.description || '',
          prix: serviceData.prix || '',
          type_id: serviceData.type_id || '',
          image: null
        });
        setImagePreview(serviceData.image_url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(service?.image_url || null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      await updateService(id, submitData);
      alert('Service modifié avec succès!');
      navigate('/admin/services');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

  if (loading || typesLoading) {
    return (
      <Layout>
        <Loading text="Chargement du service..." />
      </Layout>
    );
  }

  if (error || typesError) {
    return (
      <Layout>
        <ErrorMessage error={error || typesError} />
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <ErrorMessage error="Service non trouvé" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="service-form-page">
        <div className="page-header">
          <h1>Modifier le service: {service.nom}</h1>
          <button onClick={handleCancel} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        {error && <ErrorMessage error={error} />}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="service-form">
            <div className="form-section">
              <h3>Informations générales</h3>
              
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
            </div>

            <div className="form-section">
              <h3>Image du service</h3>
              
              <div className="form-group">
                <label htmlFor="image">Nouvelle image (optionnel)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
                <small className="form-help">
                  Formats acceptés: JPG, PNG, SVG (max 2MB). Laissez vide pour conserver l'image actuelle.
                </small>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <h4>Image actuelle/Aperçu:</h4>
                  <img src={imagePreview} alt="Aperçu" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Modification...' : 'Modifier le service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceEdit;
