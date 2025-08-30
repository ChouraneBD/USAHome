import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ServiceService from '../../../services/serviceService';
import { useServices } from '../../../hooks/useServices';
import './ServiceView.css';

const ServiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteService } = useServices();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await ServiceService.getServiceById(id);
        setService(serviceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${service.nom}" ?`)) {
      try {
        await deleteService(service.id);
        alert('Service supprimé avec succès!');
        navigate('/admin/services');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/services');
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="Chargement du service..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage error={error} />
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
      <div className="service-view-page">
        <div className="page-header">
          <h1>Détails du service</h1>
          <div className="header-actions">
            <button onClick={handleBack} className="btn btn-secondary">
              ← Retour à la liste
            </button>
            <Link to={`/admin/services/edit/${service.id}`} className="btn btn-warning">
              ✏️ Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Supprimer
            </button>
          </div>
        </div>

        <div className="service-details">
          <div className="service-main-info">
            <div className="service-image-section">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.nom}
                  className="service-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <span>Aucune image</span>
                </div>
              )}
            </div>

            <div className="service-info-section">
              <div className="info-card">
                <h2>{service.nom}</h2>
                
                <div className="info-row">
                  <label>Prix:</label>
                  <span className="price">
                    {service.prix ? `${service.prix} €` : 'Sur devis'}
                  </span>
                </div>

                <div className="info-row">
                  <label>Type de service:</label>
                  <span className="type">
                    {service.type?.nom || 'Non typé'}
                  </span>
                </div>

                <div className="info-row">
                  <label>Date de création:</label>
                  <span>{new Date(service.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                <div className="info-row">
                  <label>Dernière modification:</label>
                  <span>{new Date(service.updated_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {service.description && (
            <div className="service-description">
              <div className="info-card">
                <h3>Description</h3>
                <p>{service.description}</p>
              </div>
            </div>
          )}

          <div className="service-metadata">
            <div className="info-card">
              <h3>Informations techniques</h3>
              
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>ID du service:</label>
                  <span>#{service.id}</span>
                </div>
                
                <div className="metadata-item">
                  <label>ID du type:</label>
                  <span>#{service.type_id}</span>
                </div>
                
                <div className="metadata-item">
                  <label>Statut:</label>
                  <span className="status active">Actif</span>
                </div>
                
                <div className="metadata-item">
                  <label>Image:</label>
                  <span>{service.image ? 'Oui' : 'Non'}</span>
                </div>

                <div className="metadata-item">
                  <label>Type de prix:</label>
                  <span>{service.prix ? 'Prix fixe' : 'Sur devis'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Link 
              to={`/admin/services/edit/${service.id}`} 
              className="btn btn-primary btn-large"
            >
              Modifier ce service
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger btn-large"
            >
              Supprimer ce service
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceView;
