import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ServiceForm from '../../../components/forms/ServiceForm';
import { useServices } from '../../../hooks/useServices';
import './ServiceForm.css';

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { createService } = useServices();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await createService(formData);
      alert('Service créé avec succès!');
      navigate('/admin/services');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

  return (
    <Layout>
      <div className="service-form-page">
        <div className="page-header">
          <h1>Créer un nouveau service</h1>
          <button onClick={handleCancel} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        {error && <ErrorMessage error={error} />}

        <ServiceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default ServiceCreate;
