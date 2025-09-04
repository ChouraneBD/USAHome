import { useState, useEffect } from 'react';
import ServiceService from '../services/serviceService';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServiceService.getAllServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const createService = async (serviceData) => {
    try {
      const newService = await ServiceService.createService(serviceData);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const updatedService = await ServiceService.updateService(id, serviceData);
      setServices(prev => prev.map(s => s.id === id ? updatedService : s));
      return updatedService;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteService = async (id) => {
    try {
      await ServiceService.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService
  };
};

