import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/cards/ProductCard';
import Carousel from '../../components/common/Carousel';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useProducts, useProductCategories } from '../../hooks/useProducts';
import './Products.css';

const Products = () => {
  const { products, loading, error, refetch } = useProducts();
  const { categories } = useProductCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.categorie_id === parseInt(selectedCategory);
    const matchesSearch = !searchTerm || 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    // Handle product detail view or modal
    console.log('Product clicked:', product);
  };

  return (
    <Layout>
      <div className="products-page">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1>Nos Produits</h1>
            <p>Découvrez notre gamme complète de produits de qualité</p>
          </div>

          {/* Filters */}
          <div className="products-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="category-filters">
              <button
                className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                Tous les produits
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  {category.nom}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-controls">
            <div className="results-info">
              <p>
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory && (
                  <span> dans "{categories.find(c => c.id.toString() === selectedCategory)?.nom}"</span>
                )}
                {searchTerm && (
                  <span> pour "{searchTerm}"</span>
                )}
              </p>
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vue grille"
              >
                <span>⊞</span>
              </button>
              <button
                className={`view-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                onClick={() => setViewMode('carousel')}
                title="Vue carrousel"
              >
                <span>⊡</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && <Loading size="large" text="Chargement des produits..." />}
          
          {/* Error State */}
          {error && (
            <ErrorMessage 
              error={error} 
              title="Erreur lors du chargement des produits"
              onRetry={refetch}
            />
          )}

          {/* Products Display */}
          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="products-grid">
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                ) : (
                  <Carousel
                    items={filteredProducts}
                    renderItem={(product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onClick={handleProductClick}
                      />
                    )}
                    itemsPerView={3}
                    autoPlay={false}
                    showDots={true}
                    showArrows={true}
                    className="products-carousel"
                  />
                )
              ) : (
                <div className="no-results">
                  <h3>Aucun produit trouvé</h3>
                  <p>
                    {searchTerm || selectedCategory 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucun produit disponible pour le moment'
                    }
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                    >
                      Voir tous les produits
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
