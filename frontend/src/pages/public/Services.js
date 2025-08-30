import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ServiceCard from '../../components/cards/ServiceCard';
import Carousel from '../../components/common/Carousel';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useServices, useServiceTypes } from '../../hooks/useServices';
import './Services.css';

const Services = () => {
  const { services, loading, error, refetch } = useServices();
  const { serviceTypes } = useServiceTypes();
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

  const filteredServices = services.filter(service => {
    const matchesType = !selectedType || service.type_id === parseInt(selectedType);
    const matchesSearch = !searchTerm || 
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const handleServiceClick = (service) => {
    // Handle service detail view or contact form
    console.log('Service clicked:', service);
  };

  return (
    <Layout>
      <div className="services-page">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1>Nos Services</h1>
            <p>Des solutions professionnelles adaptées à vos besoins</p>
          </div>

          {/* Filters */}
          <div className="services-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="type-filters">
              <button
                className={`filter-btn ${selectedType === '' ? 'active' : ''}`}
                onClick={() => setSelectedType('')}
              >
                Tous les services
              </button>
              {serviceTypes.map(type => (
                <button
                  key={type.id}
                  className={`filter-btn ${selectedType === type.id.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedType(type.id.toString())}
                >
                  {type.nom}
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="view-controls">
            <div className="results-info">
              <p>
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} trouvé{filteredServices.length !== 1 ? 's' : ''}
                {selectedType && (
                  <span> dans "{serviceTypes.find(t => t.id.toString() === selectedType)?.nom}"</span>
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
          {loading && <Loading size="large" text="Chargement des services..." />}
          
          {/* Error State */}
          {error && (
            <ErrorMessage 
              error={error} 
              title="Erreur lors du chargement des services"
              onRetry={refetch}
            />
          )}

          {/* Services Display */}
          {!loading && !error && (
            <>
              {filteredServices.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="services-grid">
                    {filteredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                        onClick={handleServiceClick}
                      />
                    ))}
                  </div>
                ) : (
                  <Carousel
                    items={filteredServices}
                    renderItem={(service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                        onClick={handleServiceClick}
                      />
                    )}
                    itemsPerView={3}
                    autoPlay={false}
                    showDots={true}
                    showArrows={true}
                    className="services-carousel"
                  />
                )
              ) : (
                <div className="no-results">
                  <h3>Aucun service trouvé</h3>
                  <p>
                    {searchTerm || selectedType 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucun service disponible pour le moment'
                    }
                  </p>
                  {(searchTerm || selectedType) && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedType('');
                      }}
                    >
                      Voir tous les services
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Call to Action */}
          {!loading && !error && filteredServices.length > 0 && (
            <div className="services-cta">
              <div className="cta-content">
                <h3>Besoin d'un devis personnalisé ?</h3>
                <p>Contactez-nous pour discuter de vos besoins spécifiques</p>
                <button className="btn btn-primary btn-large">
                  Demander un devis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Services;
