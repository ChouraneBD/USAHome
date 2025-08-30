import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useProducts } from '../../../hooks/useProducts';
import './ProductsList.css';

const ProductsList = () => {
  const { products, loading, error, deleteProduct, refetch } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredProducts = products
    .filter(product => 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      try {
        await deleteProduct(product.id);
        alert('Produit supprimé avec succès!');
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
      <Loading size="large" text="Chargement des produits..." />
    </Layout>
  );

  if (error) return (
    <Layout>
      <ErrorMessage error={error} onRetry={refetch} />
    </Layout>
  );

  return (
    <Layout>
      <div className="products-list-container">
        <div className="page-header">
          <h1>Gestion des Produits</h1>
          <Link to="/admin/produits/create" className="btn btn-primary">
            + Nouveau Produit
          </Link>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="stats">
            <span className="stat-item">
              Total: <strong>{filteredProducts.length}</strong> produits
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')} className="sortable">
                  Nom {sortBy === 'nom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Image</th>
                <th onClick={() => handleSort('prix')} className="sortable">
                  Prix {sortBy === 'prix' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Catégorie</th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Date création {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-name">
                      <strong>{product.nom}</strong>
                      <small>{product.description?.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>
                    <div className="product-image-cell">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.nom} />
                      ) : (
                        <div className="no-image">Pas d'image</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="price">{product.prix} €</span>
                  </td>
                  <td>
                    <span className="category">
                      {product.categorie?.nom || 'Non catégorisé'}
                    </span>
                  </td>
                  <td>
                    <span className="date">
                      {new Date(product.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link 
                        to={`/admin/produits/view/${product.id}`}
                        className="btn btn-sm btn-info"
                        title="Voir"
                      >
                        👁️
                      </Link>
                      <Link 
                        to={`/admin/produits/edit/${product.id}`}
                        className="btn btn-sm btn-warning"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(product)}
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

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>Aucun produit trouvé</h3>
              <p>
                {searchTerm 
                  ? 'Aucun produit ne correspond à votre recherche'
                  : 'Commencez par créer votre premier produit'
                }
              </p>
              <Link to="/admin/produits/create" className="btn btn-primary">
                Créer un produit
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsList;
