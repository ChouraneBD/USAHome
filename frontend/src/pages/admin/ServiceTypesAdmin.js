import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ServiceTypeCard from '../../components/cards/ServiceTypeCard';
import ServiceTypeForm from '../../components/forms/ServiceTypeForm';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useServiceTypes } from '../../hooks/useServiceTypes';
import './ServiceTypesAdmin.css';

const ServiceTypesAdmin = () => {
  const {
    serviceTypes,
    loading,
    error,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    refetch
  } = useServiceTypes();

  const [showForm, setShowForm] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = () => {
    setEditingServiceType(null);
    setShowForm(true);
  };

  const handleEdit = (serviceType) => {
    setEditingServiceType(serviceType);
    setShowForm(true);
  };

  const handleDelete = async (serviceType) => {
    const confirmMessage = serviceType.services_count > 0
      ? `Attention: Ce type de service contient ${serviceType.services_count} service(s). La suppression n'est pas possible.`
      : `Êtes-vous sûr de vouloir supprimer "${serviceType.name}" ?`;

    if (serviceType.services_count > 0) {
      alert(confirmMessage);
      return;
    }

    if (window.confirm(confirmMessage)) {
      try {
        await deleteServiceType(serviceType.id);
        alert('Type de service supprimé avec succès!');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingServiceType) {
        await updateServiceType(editingServiceType.id, formData);
        alert('Type de service modifié avec succès!');
      } else {
        await createServiceType(formData);
        alert('Type de service créé avec succès!');
      }

      setShowForm(false);
      setEditingServiceType(null);
      refetch();
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingServiceType(null);
  };

  if (showForm) {
    return (
      <Layout>
        <div className="admin-container">
          <ServiceTypeForm
            serviceType={editingServiceType}
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
          <h1>Gestion des Types de Services</h1>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Nouveau Type
          </button>
        </div>

        {loading && <Loading size="large" text="Chargement des types de services..." />}

        {error && (
          <ErrorMessage
            error={error}
            title="Erreur lors du chargement des types de services"
            onRetry={refetch}
          />
        )}

        {!loading && !error && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>{serviceTypes.length}</h3>
                <p>Types de services</p>
              </div>
              <div className="stat-card">
                <h3>{serviceTypes.reduce((total, st) => total + (st.services_count || 0), 0)}</h3>
                <p>Services associés</p>
              </div>
              <div className="stat-card">
                <h3>{serviceTypes.filter(st => (st.services_count || 0) === 0).length}</h3>
                <p>Types vides</p>
              </div>
            </div>

            <div className="admin-grid">
              {serviceTypes.map((serviceType) => (
                <ServiceTypeCard
                  key={serviceType.id}
                  serviceType={serviceType}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {serviceTypes.length === 0 && (
              <div className="empty-state">
                <h3>Aucun type de service trouvé</h3>
                <p>Commencez par créer votre premier type de service</p>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Créer un type de service
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ServiceTypesAdmin;