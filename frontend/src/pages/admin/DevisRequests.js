import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useDevis } from '../../hooks/useDevis';
import DevisService from '../../services/devisService';
import './DevisRequests.css';

const DevisRequests = () => {
  const { devis, loading: devisLoading, error: devisError, updateDevis, deleteDevis } = useDevis();
  const [statistics, setStatistics] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    traite: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const loading = devisLoading || statsLoading;
  const error = devisError || statsError;
  const apiAvailable = !devisError && !statsError;

  useEffect(() => {
    const fetchStatistics = async (retryCount = 0) => {
      const maxRetries = 2;

      try {
        setStatsLoading(true);
        setStatsError(null);
        const data = await DevisService.getDevisStatistics();
        if (data && data.success && data.data && typeof data.data === 'object') {
          setStatistics({
            total: typeof data.data.total === 'number' ? data.data.total : 0,
            nouveau: typeof data.data.nouveau === 'number' ? data.data.nouveau : 0,
            en_cours: typeof data.data.en_cours === 'number' ? data.data.en_cours : 0,
            traite: typeof data.data.traite === 'number' ? data.data.traite : 0
          });
        } else {
          // API response is invalid, use defaults
          setStatistics({
            total: 0,
            nouveau: 0,
            en_cours: 0,
            traite: 0
          });
        }
      } catch (err) {
        console.error('Statistics fetch error:', err);

        // Retry logic for network errors
        if (retryCount < maxRetries && (err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
          console.log(`Retrying statistics fetch (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => fetchStatistics(retryCount + 1), 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }

        let errorMessage = 'Failed to load statistics';

        if (err.message.includes('404')) {
          errorMessage = 'Statistics endpoint not found. Please check if the backend server is running on the correct port.';
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to the server. Please check your internet connection and ensure the backend server is running on http://127.0.0.1:8000.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error occurred while loading statistics. Please check the backend logs.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setStatsError(errorMessage);
        // Ensure statistics is always a valid object
        setStatistics({
          total: 0,
          nouveau: 0,
          en_cours: 0,
          traite: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // No need for manual data fetching - the hook handles it

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'nouveau':
        return '#2563eb';
      case 'en_cours':
        return '#f59e0b';
      case 'traite':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'nouveau':
        return 'Nouveau';
      case 'en_cours':
        return 'En cours';
      case 'traite':
        return 'Traité';
      default:
        return 'Inconnu';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'service':
        return 'Service';
      case 'product':
        return 'Produit';
      case 'both':
        return 'Service + Produit';
      default:
        return 'Non spécifié';
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Use the hook's updateDevis function
      await updateDevis(id, { statut: newStatus });

      // Update selected request if it's the current one
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, statut: newStatus });
      }

      alert('Statut mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const deleteRequest = async (id) => {
    // Simple confirmation - in a real app, you'd use a proper modal
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de devis ?')) {
      return;
    }

    try {
      // Use the hook's deleteDevis function
      await deleteDevis(id);

      // Clear selection if it was the deleted request
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }

      alert('Demande supprimée avec succès!');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="devis-requests-page">
          <Loading text="Chargement des demandes de devis..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="devis-requests-page">
          <ErrorMessage error={error} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="devis-requests-page">
        <div className="page-header">
          <h1>📋 Demandes de Devis</h1>
          <p>Gestion de toutes les demandes de devis reçues</p>
          {!apiAvailable && (
            <div className="api-warning" style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '12px',
              margin: '10px 0',
              color: '#856404'
            }}>
              ⚠️ Le serveur API n'est pas disponible. Aucune donnée ne peut être chargée ou modifiée.
              Veuillez démarrer le serveur backend pour accéder aux fonctionnalités.
            </div>
          )}
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{statistics?.total || 0}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statistics?.nouveau || 0}</div>
            <div className="stat-label">Nouveaux</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statistics?.en_cours || 0}</div>
            <div className="stat-label">En cours</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statistics?.traite || 0}</div>
            <div className="stat-label">Traités</div>
          </div>
        </div>

        <div className="requests-container">
          <div className="requests-list">
            {!apiAvailable && devis.length === 0 ? (
              <div className="no-data-message" style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h3>Aucune donnée disponible</h3>
                <p>Le serveur backend n'est pas démarré. Démarrez le serveur pour voir les demandes de devis.</p>
              </div>
            ) : devis.map((request) => (
              <div
                key={request.id}
                className={`request-card ${selectedRequest?.id === request.id ? 'selected' : ''}`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.nom}</h3>
                    <p className="request-email">{request.email}</p>
                    <p className="request-date">{formatDate(request.dateSoumission)}</p>
                  </div>
                  <div className="request-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.statut) }}
                    >
                      {getStatusText(request.statut)}
                    </span>
                  </div>
                </div>
                <div className="request-preview">
                  <p><strong>Objet:</strong> {request.objet}</p>
                  <p><strong>Type:</strong> {getTypeText(request.typeDevis)}</p>
                  <p className="message-preview">
                    {request.message.length > 100
                      ? `${request.message.substring(0, 100)}...`
                      : request.message
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="request-details">
            {selectedRequest ? (
              <div className="details-content">
                <div className="details-header">
                  <h2>Détails de la demande #{selectedRequest.id}</h2>
                  <span
                    className="status-badge large"
                    style={{ backgroundColor: getStatusColor(selectedRequest.statut) }}
                  >
                    {getStatusText(selectedRequest.statut)}
                  </span>
                </div>

                <div className="details-grid">
                  <div className="detail-section">
                    <h3>Informations client</h3>
                    <div className="detail-item">
                      <label>Nom:</label>
                      <span>{selectedRequest.nom}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedRequest.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Téléphone:</label>
                      <span>{selectedRequest.telephone}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Demande</h3>
                    <div className="detail-item">
                      <label>Objet:</label>
                      <span>{selectedRequest.objet}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type de devis:</label>
                      <span>{getTypeText(selectedRequest.typeDevis)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date de soumission:</label>
                      <span>{formatDate(selectedRequest.dateSoumission)}</span>
                    </div>
                  </div>
                </div>

                <div className="message-section">
                  <h3>Message</h3>
                  <div className="message-content">
                    {selectedRequest.message}
                  </div>
                </div>

                <div className="actions-section">
                  <button
                    className="action-btn primary"
                    onClick={() => window.open(`mailto:${selectedRequest.email}?subject=Réponse à votre demande de devis - ${selectedRequest.objet}`, '_blank')}
                  >
                    Répondre par email
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => updateStatus(selectedRequest.id, 'traite')}
                  >
                    Marquer comme traité
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => deleteRequest(selectedRequest.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📋</div>
                <h3>Sélectionnez une demande</h3>
                <p>Cliquez sur une demande dans la liste pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DevisRequests;