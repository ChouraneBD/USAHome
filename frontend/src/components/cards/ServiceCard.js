import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service, onClick }) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(service);
    }
  };

  const serviceImage = service?.image_url
    ? service.image_url.startsWith('http')
      ? service.image_url
      : `http://127.0.0.1:8000${service.image_url}`
    : null;

  return (
    <div className="service-card" onClick={handleCardClick}>
      <div className="service-image-container">
        {serviceImage && (
          <img src={serviceImage} alt={service.nom} className="service-image" />
        )}
      </div>
      <div className="service-info">
        <h4 className="service-name">{service.nom}</h4>
        <div className="service-details">
          <span className="price">{service.prix ? `${service.prix} €` : 'Sur devis'}</span>
          <span className="category">{service.type?.nom || 'Non typé'}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
