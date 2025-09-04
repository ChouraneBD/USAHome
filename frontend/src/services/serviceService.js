import ApiService from './api';

class ServiceService {
  // Get all services
  async getAllServices() {
    try {
      return await ApiService.get('/services');
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  // Get service by ID
  async getServiceById(id) {
    try {
      return await ApiService.get(`/services/${id}`);
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }

  // Create new service
  async createService(serviceData) {
    try {
      return await ApiService.post('/services', serviceData);
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  // Update service
  async updateService(id, serviceData) {
    try {
      return await ApiService.patch(`/services/${id}`, serviceData);
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      throw error;
    }
  }

  // Delete service
  async deleteService(id) {
    try {
      return await ApiService.delete(`/services/${id}`);
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceService();
