import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useCategories } from '../../../hooks/useCategories';
import './CategoryView.css';

const CategoryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategories();

  const category = categories.find(c => c.id === parseInt(id));

  const handleBack = () => {
    navigate('/admin/categories');
  };

  if (!category) {
    return (
      <Layout>
        <ErrorMessage error="Catégorie non trouvée" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="category-view-page">
        <div className="page-header">
          <h1>Détails de la catégorie</h1>
          <button onClick={handleBack} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        <div className="category-details-container">
          <div className="category-card">
            <div className="category-header">
              <h2>{category.nom}</h2>
              <div className="category-actions">
                <Link
                  to={`/admin/categories/edit/${category.id}`}
                  className="btn btn-warning"
                >
                  ✏️ Modifier
                </Link>
              </div>
            </div>

            <div className="category-info">
              <div className="info-group">
                <label>ID:</label>
                <span>{category.id}</span>
              </div>

              <div className="info-group">
                <label>Nom:</label>
                <span>{category.nom}</span>
              </div>

              <div className="info-group">
                <label>Date de création:</label>
                <span>{new Date(category.created_at).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="info-group">
                <label>Dernière modification:</label>
                <span>{new Date(category.updated_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryView;