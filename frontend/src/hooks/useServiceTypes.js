import { useState, useEffect } from 'react';
import ServiceTypeService from '../services/serviceTypeService';

export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServiceTypeService.getAllServiceTypes();
      setServiceTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const createServiceType = async (serviceTypeData) => {
    try {
      const newServiceType = await ServiceTypeService.createServiceType(serviceTypeData);
      setServiceTypes(prev => [...prev, newServiceType]);
      return newServiceType;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateServiceType = async (id, serviceTypeData) => {
    try {
      const updatedServiceType = await ServiceTypeService.updateServiceType(id, serviceTypeData);
      setServiceTypes(prev => prev.map(st => st.id === id ? updatedServiceType : st));
      return updatedServiceType;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteServiceType = async (id) => {
    try {
      await ServiceTypeService.deleteServiceType(id);
      setServiceTypes(prev => prev.filter(st => st.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    serviceTypes,
    loading,
    error,
    refetch: fetchServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType
  };
};