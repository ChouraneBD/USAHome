import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useCategories } from '../../../hooks/useCategories';
import './CategoryForm.css';

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, updateCategory } = useCategories();

  const [formData, setFormData] = useState({
    nom: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const category = categories.find(c => c.id === parseInt(id));
    if (category) {
      setFormData({
        nom: category.nom
      });
      setFetchLoading(false);
    } else {
      setError('Catégorie non trouvée');
      setFetchLoading(false);
    }
  }, [categories, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateCategory(id, formData);
      alert('Catégorie mise à jour avec succès!');
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

  if (fetchLoading) {
    return (
      <Layout>
        <Loading text="Chargement de la catégorie..." />
      </Layout>
    );
  }

  if (error && !formData.nom) {
    return (
      <Layout>
        <ErrorMessage error={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="category-form-page">
        <div className="page-header">
          <h1>Modifier la catégorie</h1>
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
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryEdit;