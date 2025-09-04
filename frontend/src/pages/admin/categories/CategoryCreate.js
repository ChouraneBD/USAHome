import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useCategories } from '../../../hooks/useCategories';
import './CategoryForm.css';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const { createCategory } = useCategories();

  const [formData, setFormData] = useState({
    nom: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCategory(formData);
      alert('Catégorie créée avec succès!');
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  return (
    <Layout>
      <div className="category-form-page">
        <div className="page-header">
          <h1>Créer une nouvelle catégorie</h1>
          <button onClick={handleCancel} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        {error && <ErrorMessage error={error} />}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-section">
              <h3>Informations de la catégorie</h3>

              <div className="form-group">
                <label htmlFor="nom">Nom de la catégorie *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le nom de la catégorie"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
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
                {loading ? 'Création...' : 'Créer la catégorie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryCreate;