import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const productImage = product?.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `http://127.0.0.1:8000${product.image_url}`
    : null;

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        {productImage && (
          <img src={productImage} alt={product.nom} className="product-image" />
        )}
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.nom}</h4>
        <div className="product-details">
          <span className="price">{product.prix} €</span>
          {product.categorie && <span className="category">{product.categorie.nom}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
