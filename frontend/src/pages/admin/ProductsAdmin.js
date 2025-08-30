import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/cards/ProductCard';
import ProductForm from '../../components/forms/ProductForm';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useProducts } from '../../hooks/useProducts';
import './ProductsAdmin.css';

const ProductsAdmin = () => {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    refetch 
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

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

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        alert('Produit modifié avec succès!');
      } else {
        await createProduct(formData);
        alert('Produit créé avec succès!');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <Layout>
        <div className="admin-container">
          <ProductForm
            product={editingProduct}
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
          <h1>Gestion des Produits</h1>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Nouveau Produit
          </button>
        </div>

        {loading && <Loading size="large" text="Chargement des produits..." />}
        
        {error && (
          <ErrorMessage 
            error={error} 
            title="Erreur lors du chargement des produits"
            onRetry={refetch}
          />
        )}

        {!loading && !error && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>{products.length}</h3>
                <p>Produits total</p>
              </div>
            </div>

            <div className="admin-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <h3>Aucun produit trouvé</h3>
                <p>Commencez par créer votre premier produit</p>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Créer un produit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductsAdmin;
