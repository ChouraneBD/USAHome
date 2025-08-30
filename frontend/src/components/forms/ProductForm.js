import React, { useState, useEffect } from 'react';
import { useProductCategories } from '../../hooks/useProducts';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import './ProductForm.css';

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie_id: '',
    image: null
  });

  const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories();

  useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom || '',
        description: product.description || '',
        prix: product.prix || '',
        categorie_id: product.categorie_id || '',
        image: null
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  if (categoriesLoading) {
    return <Loading text="Chargement des catégories..." />;
  }

  if (categoriesError) {
    return <ErrorMessage error={categoriesError} />;
  }

  return (
    <div className="product-form-container">
      <h2>{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nom">Nom du produit *</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du produit"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Décrivez le produit"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prix">Prix (€) *</label>
            <input
              type="number"
              id="prix"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorie_id">Catégorie *</label>
            <select
              id="categorie_id"
              name="categorie_id"
              value={formData.categorie_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image du produit</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          <small className="form-help">
            Formats acceptés: JPG, PNG, SVG (max 2MB)
          </small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
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
            {loading ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
