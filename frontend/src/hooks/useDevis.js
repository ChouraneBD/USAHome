import { useState, useEffect } from 'react';
import DevisService from '../services/devisService';

export const useDevis = () => {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DevisService.getAllDevis();
      setDevis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  const createDevis = async (devisData) => {
    try {
      const newDevis = await DevisService.createDevis(devisData);
      setDevis(prev => [...prev, newDevis]);
      return newDevis;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDevis = async (id, devisData) => {
    try {
      const updatedDevis = await DevisService.updateDevis(id, devisData);
      setDevis(prev => prev.map(d => d.id === id ? updatedDevis : d));
      return updatedDevis;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDevis = async (id) => {
    try {
      await DevisService.deleteDevis(id);
      setDevis(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    devis,
    loading,
    error,
    refetch: fetchDevis,
    createDevis,
    updateDevis,
    deleteDevis
  };
};

export const useDevisStatistics = () => {
  const [statistics, setStatistics] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    traite: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DevisService.getDevisStatistics();
      if (data && data.success && data.data) {
        setStatistics({
          total: data.data.total || 0,
          nouveau: data.data.nouveau || 0,
          en_cours: data.data.en_cours || 0,
          traite: data.data.traite || 0
        });
      } else {
        // Keep default statistics if API response is invalid
        setStatistics({
          total: 0,
          nouveau: 0,
          en_cours: 0,
          traite: 0
        });
      }
    } catch (err) {
      setError(err.message);
      // Keep default statistics on error
      setStatistics({
        total: 0,
        nouveau: 0,
        en_cours: 0,
        traite: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return { statistics, loading, error, refetch: fetchStatistics };
};