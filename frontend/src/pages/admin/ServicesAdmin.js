import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ServiceCard from '../../components/cards/ServiceCard';
import ServiceForm from '../../components/forms/ServiceForm';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useServices } from '../../hooks/useServices';
import './ServicesAdmin.css';

const ServicesAdmin = () => {
  const { 
    services, 
    loading, 
    error, 
    createService, 
    updateService, 
    deleteService,
    refetch 
  } = useServices();

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${service.nom}" ?`)) {
      try {
        await deleteService(service.id);
        alert('Service supprimé avec succès!');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingService) {
        await updateService(editingService.id, formData);
        alert('Service modifié avec succès!');
      } else {
        await createService(formData);
        alert('Service créé avec succès!');
      }
      
      setShowForm(false);
      setEditingService(null);
      refetch();
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (showForm) {
    return (
      <Layout>
        <div className="admin-container">
          <ServiceForm
            service={editingService}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Gestion des Services</h1>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Nouveau Service
          </button>
        </div>

        {loading && <Loading size="large" text="Chargement des services..." />}
        
        {error && (
          <ErrorMessage 
            error={error} 
            title="Erreur lors du chargement des services"
            onRetry={refetch}
          />
        )}

        {!loading && !error && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>{services.length}</h3>
                <p>Services total</p>
              </div>
              <div className="stat-card">
                <h3>{services.filter(s => s.prix).length}</h3>
                <p>Avec prix fixe</p>
              </div>
              <div className="stat-card">
                <h3>{services.filter(s => !s.prix).length}</h3>
                <p>Sur devis</p>
              </div>
            </div>

            <div className="admin-grid">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {services.length === 0 && (
              <div className="empty-state">
                <h3>Aucun service trouvé</h3>
                <p>Commencez par créer votre premier service</p>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Créer un service
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ServicesAdmin;
