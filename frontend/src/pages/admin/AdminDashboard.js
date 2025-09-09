import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useDevis, useDevisStatistics } from '../../hooks/useDevis';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { devis, loading: devisLoading } = useDevis();
  const { statistics, loading: statsLoading } = useDevisStatistics();
  const [stats, setStats] = useState({
    devis: { total: 0, nouveau: 0, en_cours: 0, traite: 0 },
    services: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentDevis, setRecentDevis] = useState([]);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let services = [];
        let products = [];
        let apiErrors = 0;

        // Try to fetch services count
        try {
          const servicesResponse = await fetch('http://127.0.0.1:8000/api/services');
          if (servicesResponse.ok) {
            services = await servicesResponse.json();
          } else {
            apiErrors++;
          }
        } catch (err) {
          console.warn('Failed to fetch services:', err);
          apiErrors++;
        }

        // Try to fetch products count
        try {
          const productsResponse = await fetch('http://127.0.0.1:8000/api/produits');
          if (productsResponse.ok) {
            products = await productsResponse.json();
          } else {
            apiErrors++;
          }
        } catch (err) {
          console.warn('Failed to fetch products:', err);
          apiErrors++;
        }

        // Check if API is available
        setApiAvailable(apiErrors < 2);

        setStats(prev => ({
          ...prev,
          services: Array.isArray(services) ? services.length : 0,
          products: Array.isArray(products) ? products.length : 0
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update stats when devis data changes
  useEffect(() => {
    if (!devisLoading && Array.isArray(devis)) {
      const total = devis.length;
      const nouveau = devis.filter(d => d.statut === 'nouveau').length;
      const en_cours = devis.filter(d => d.statut === 'en_cours').length;
      const traite = devis.filter(d => d.statut === 'traite').length;
      
      setStats(prev => ({
        ...prev,
        devis: { total, nouveau, en_cours, traite }
      }));
      
      setRecentDevis(devis.slice(0, 5)); // Get 5 most recent
    }
  }, [devis, devisLoading]);

  // Update stats when statistics data changes
  useEffect(() => {
    if (!statsLoading && statistics) {
      setStats(prev => ({
        ...prev,
        devis: statistics
      }));
    }
  }, [statistics, statsLoading]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <Loading text="Chargement du tableau de bord..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <ErrorMessage error={error} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>🏠 Tableau de Bord Administrateur</h1>
          <p>Bienvenue dans votre panneau de contrôle USA Home</p>
          {!apiAvailable && (
            <div className="api-warning" style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '12px',
              margin: '10px 0',
              color: '#856404'
            }}>
              ⚠️ Le serveur API n'est pas disponible. Les données affichées sont des valeurs par défaut.
              Veuillez démarrer le serveur backend pour voir les données réelles.
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="stats-grid" >
          <div className="stat-card primary text">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.devis.total}</h3>
              <p>Demandes de devis</p>
            </div>
            <div className="stat-trend">
              <span className="new-count">{stats.devis.nouveau} nouveaux</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>{stats.services}</h3>
              <p>Services</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+2 ce mois</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.products}</h3>
              <p>Produits</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+5 ce mois</span>
            </div>
          </div>

         
        </div>

        <div className="dashboard-content">
          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>📝 Dernières demandes de devis</h2>
              <Link to="/admin/devis" className="view-all-link">Voir tout</Link>
            </div>

            <div className="recent-activity">
              {recentDevis.length > 0 ? (
                recentDevis.map((devis) => (
                  <div key={devis.id} className="activity-item">
                    <div className="activity-icon">
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(devis.statut) }}></span>
                    </div>
                    <div className="activity-content">
                      <h4>{devis.objet}</h4>
                      <p>Par {devis.nom} • {formatDate(devis.created_at)}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`status-badge ${devis.statut}`}>
                        {devis.statut === 'nouveau' ? 'Nouveau' :
                         devis.statut === 'en_cours' ? 'En cours' :
                         devis.statut === 'traite' ? 'Traité' : 'Annulé'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <p>Aucune demande de devis récente</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>🚀 Actions Rapides</h2>
            </div>

            <div className="quick-actions">
              <Link to="/admin/devis" className="action-card">
                <div className="action-icon">📋</div>
                <div className="action-content">
                  <h3>Gérer les devis</h3>
                  <p>Voir et traiter les demandes de devis</p>
                </div>
              </Link>

              <Link to="/admin/services" className="action-card">
                <div className="action-icon">🔧</div>
                <div className="action-content">
                  <h3>Gérer les services</h3>
                  <p>Ajouter, modifier ou supprimer des services</p>
                </div>
              </Link>

              <Link to="/admin/produits" className="action-card">
                <div className="action-icon">📦</div>
                <div className="action-content">
                  <h3>Gérer les produits</h3>
                  <p>Ajouter, modifier ou supprimer des produits</p>
                </div>
              </Link><Link to="/admin/service-types" className="action-card">
                <div className="action-icon">🏷️</div>
                <div className="action-content">
                  <h3>Types de services</h3>
                  <p>Gérer les catégories de services</p>
                </div>
              </Link>

              <Link to="/admin/categories" className="action-card">
                <div className="action-icon">🗂️</div>
                <div className="action-content">
                  <h3>Catégories de produits</h3>
                  <p>Gérer les catégories de produits</p>
                </div>
              </Link>

              <div className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h3>Rapports</h3>
                  <p>Consulter les statistiques détaillées</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>🔧 État du système</h2>
            </div>

            <div className="system-status">
              <div className="status-item">
                <div className="status-indicator online"></div>
                <div className="status-content">
                  <h4>Serveur API</h4>
                  <p>En ligne et opérationnel</p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-indicator online"></div>
                <div className="status-content">
                  <h4>Base de données</h4>
                  <p>Connectée et synchronisée</p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-indicator online"></div>
                <div className="status-content">
                  <h4>Stockage de fichiers</h4>
                  <p>Configuration active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;