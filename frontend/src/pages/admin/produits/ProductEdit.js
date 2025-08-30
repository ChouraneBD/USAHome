import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useProducts, useProductCategories } from '../../../hooks/useProducts';
import ProductService from '../../../services/productService';
import './ProductForm.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories();
  
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie_id: '',
    image: null
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await ProductService.getProductById(id);
        setProduct(productData);
        setFormData({
          nom: productData.nom || '',
          description: productData.description || '',
          prix: productData.prix || '',
          categorie_id: productData.categorie_id || '',
          image: null
        });
        setImagePreview(productData.image_url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(product?.image_url || null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      await updateProduct(id, submitData);
      alert('Produit modifié avec succès!');
      navigate('/admin/produits');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/produits');
  };

  if (loading || categoriesLoading) {
    return (
      <Layout>
        <Loading text="Chargement du produit..." />
      </Layout>
    );
  }

  if (error || categoriesError) {
    return (
      <Layout>
        <ErrorMessage error={error || categoriesError} />
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
      <div className="product-form-page">
        <div className="page-header">
          <h1>Modifier le produit: {product.nom}</h1>
          <button onClick={handleCancel} className="btn btn-secondary">
            ← Retour à la liste
          </button>
        </div>

        {error && <ErrorMessage error={error} />}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3>Informations générales</h3>
              
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
            </div>

            <div className="form-section">
              <h3>Image du produit</h3>
              
              <div className="form-group">
                <label htmlFor="image">Nouvelle image (optionnel)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
                <small className="form-help">
                  Formats acceptés: JPG, PNG, SVG (max 2MB). Laissez vide pour conserver l'image actuelle.
                </small>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <h4>Image actuelle/Aperçu:</h4>
                  <img src={imagePreview} alt="Aperçu" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Modification...' : 'Modifier le produit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProductEdit;
