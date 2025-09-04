import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ServiceForm from '../../../components/forms/ServiceForm';
import { useServices } from '../../../hooks/useServices';
import ServiceService from '../../../services/serviceService';
import './ServiceForm.css';

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateService } = useServices();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      await updateService(id, formData);
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
      <div className="service-form-page">
        <div className="page-header">
          <h1>Modifier le service: {service.nom}</h1>
          <button onClick={handleCancel} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        {error && <ErrorMessage error={error} />}

        <ServiceForm
          service={service}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </Layout>
  );
};

export default ServiceEdit;
