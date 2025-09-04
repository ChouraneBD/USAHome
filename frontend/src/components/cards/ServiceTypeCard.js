import React from 'react';
import './ServiceTypeCard.css';

const ServiceTypeCard = ({ serviceType, showActions, onEdit, onDelete }) => {
  const handleEdit = () => {
    if (onEdit) onEdit(serviceType);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(serviceType);
  };

  return (
    <div className="service-type-card">
      <div className="service-type-header">
        <h3 className="service-type-name">{serviceType.name}</h3>
        <div className="service-type-stats">
          <span className="services-count">
            {serviceType.services_count || 0} service{serviceType.services_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {serviceType.description && (
        <div className="service-type-description">
          <p>{serviceType.description}</p>
        </div>
      )}

      <div className="service-type-footer">
        <div className="service-type-meta">
          <span className="created-date">
            Créé le {new Date(serviceType.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {showActions && (
          <div className="service-type-actions">
            <button
              className="btn-action btn-edit"
              onClick={handleEdit}
              title="Modifier"
            >
              ✏️
            </button>
            <button
              className="btn-action btn-delete"
              onClick={handleDelete}
              title="Supprimer"
              disabled={serviceType.services_count > 0}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTypeCard;