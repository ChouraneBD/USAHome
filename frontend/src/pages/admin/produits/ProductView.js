import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ProductService from '../../../services/productService';
import { useProducts } from '../../../hooks/useProducts';
import './ProductView.css';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteProduct } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await ProductService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      try {
        await deleteProduct(product.id);
        alert('Produit supprimé avec succès!');
        navigate('/admin/produits');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/produits');
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="Chargement du produit..." />
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

  if (!product) {
    return (
      <Layout>
        <ErrorMessage error="Produit non trouvé" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="product-view-page">
        <div className="page-header">
          <h1>Détails du produit</h1>
          <div className="header-actions">
            <button onClick={handleBack} className="btn btn-secondary">
              ← Retour à la liste
            </button>
            <Link to={`/admin/produits/edit/${product.id}`} className="btn btn-warning">
              ✏️ Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Supprimer
            </button>
          </div>
        </div>

        <div className="product-details">
          <div className="product-main-info">
            <div className="product-image-section">
              {product.image_url ? (
                <img 
                  src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000${product.image_url}`}
                  alt={product.nom}
                  className="product-image"
                  onError={(e) => {
                    console.log('Product image failed to load:', product.image_url);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="no-image-placeholder"><span>Aucune image</span></div>';
                  }}
                />
              ) : (
                <div className="no-image-placeholder">
                  <span>Aucune image</span>
                </div>
              )}
            </div>

            <div className="product-info-section">
              <div className="info-card">
                <h2>{product.nom}</h2>
                
                <div className="info-row">
                  <label>Prix:</label>
                  <span className="price">{product.prix} €</span>
                </div>

                <div className="info-row">
                  <label>Catégorie:</label>
                  <span className="category">
                    {product.categorie?.nom || 'Non catégorisé'}
                  </span>
                </div>

                <div className="info-row">
                  <label>Date de création:</label>
                  <span>{new Date(product.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                <div className="info-row">
                  <label>Dernière modification:</label>
                  <span>{new Date(product.updated_at).toLocaleDateString('fr-FR', {
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

          {product.description && (
            <div className="product-description">
              <div className="info-card">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            </div>
          )}

          <div className="product-metadata">
            <div className="info-card">
              <h3>Informations techniques</h3>
              
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>ID du produit:</label>
                  <span>#{product.id}</span>
                </div>
                
                <div className="metadata-item">
                  <label>ID de la catégorie:</label>
                  <span>#{product.categorie_id}</span>
                </div>
                
                <div className="metadata-item">
                  <label>Statut:</label>
                  <span className="status active">Actif</span>
                </div>
                
                <div className="metadata-item">
                  <label>Image:</label>
                  <span>{product.image ? 'Oui' : 'Non'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Link 
              to={`/admin/produits/edit/${product.id}`} 
              className="btn btn-primary btn-large"
            >
              Modifier ce produit
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger btn-large"
            >
              Supprimer ce produit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductView;
