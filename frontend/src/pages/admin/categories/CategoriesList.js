import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useCategories } from '../../../hooks/useCategories';
import './CategoriesList.css';

const CategoriesList = () => {
  const { categories, loading, error, deleteCategory, refetch } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredCategories = categories
    .filter(category =>
      category.nom.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  const handleDelete = async (category) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${category.nom}" ?`)) {
      try {
        await deleteCategory(category.id);
        alert('Catégorie supprimée avec succès!');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) return (
    <Layout>
      <Loading size="large" text="Chargement des catégories..." />
    </Layout>
  );

  if (error) return (
    <Layout>
      <ErrorMessage error={error} onRetry={refetch} />
    </Layout>
  );

  return (
    <Layout>
      <div className="categories-list-container">
        <div className="page-header">
          <h1>Gestion des Catégories</h1>
          <Link to="/admin/categories/create" className="btn btn-primary">
            + Nouvelle Catégorie
          </Link>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="stats">
            <span className="stat-item">
              Total: <strong>{filteredCategories.length}</strong> catégories
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')} className="sortable">
                  Nom {sortBy === 'nom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Date création {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="category-name">
                      <strong>{category.nom}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="date">
                      {new Date(category.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link
                        to={`/admin/categories/view/${category.id}`}
                        className="btn btn-sm btn-info"
                        title="Voir"
                      >
                        👁️
                      </Link>
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="btn btn-sm btn-warning"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(category)}
                        className="btn btn-sm btn-danger"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="empty-state">
              <h3>Aucune catégorie trouvée</h3>
              <p>
                {searchTerm
                  ? 'Aucune catégorie ne correspond à votre recherche'
                  : 'Commencez par créer votre première catégorie'
                }
              </p>
              <Link to="/admin/categories/create" className="btn btn-primary">
                Créer une catégorie
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesList;