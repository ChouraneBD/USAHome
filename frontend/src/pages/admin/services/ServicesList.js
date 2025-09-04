import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useServices } from '../../../hooks/useServices';
import './ServicesList.css';

const ServicesList = () => {
  const { services, loading, error, deleteService, refetch } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredServices = services
    .filter(service => 
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async (service) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${service.nom}" ?`)) {
      try {
        await deleteService(service.id);
        alert('Service supprimé avec succès!');
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
      <Loading size="large" text="Chargement des services..." />
    </Layout>
  );

  if (error) return (
    <Layout>
      <ErrorMessage error={error} onRetry={refetch} />
    </Layout>
  );

  return (
    <Layout>
      <div className="services-list-container">
        <div className="page-header">
          <h1>Gestion des Services</h1>
          <Link to="/admin/services/create" className="btn btn-primary">
            + Nouveau Service
          </Link>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="stats">
            <span className="stat-item">
              Total: <strong>{filteredServices.length}</strong> services
            </span>
            <span className="stat-item">
              Avec prix: <strong>{filteredServices.filter(s => s.prix).length}</strong>
            </span>
            <span className="stat-item">
              Sur devis: <strong>{filteredServices.filter(s => !s.prix).length}</strong>
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')} className="sortable">
                  Nom {sortBy === 'nom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Image</th>
                <th onClick={() => handleSort('prix')} className="sortable">
                  Prix {sortBy === 'prix' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Type</th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Date création {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className="service-name">
                      <strong>{service.nom}</strong>
                      <small>{service.description?.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>
                    <div className="service-image-cell">
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.nom} />
                      ) : (
                        <div className="no-image">Pas d'image</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="price">
                      {service.prix ? `${service.prix} €` : 'Sur devis'}
                    </span>
                  </td>
                  <td>
                    <span className="service-type">
                      {service.type?.name || 'Non typé'}
                    </span>
                  </td>
                  <td>
                    <span className="date">
                      {new Date(service.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link 
                        to={`/admin/services/view/${service.id}`}
                        className="btn btn-sm btn-info"
                        title="Voir"
                      >
                        👁️
                      </Link>
                      <Link 
                        to={`/admin/services/edit/${service.id}`}
                        className="btn btn-sm btn-warning"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(service)}
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

          {filteredServices.length === 0 && (
            <div className="empty-state">
              <h3>Aucun service trouvé</h3>
              <p>
                {searchTerm 
                  ? 'Aucun service ne correspond à votre recherche'
                  : 'Commencez par créer votre premier service'
                }
              </p>
              <Link to="/admin/services/create" className="btn btn-primary">
                Créer un service
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ServicesList;
