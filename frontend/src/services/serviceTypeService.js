import ApiService from './api';

class ServiceTypeService {
  // Get all service types
  async getAllServiceTypes() {
    try {
      return await ApiService.get('/service-types');
    } catch (error) {
      console.error('Error fetching service types:', error);
      throw error;
    }
  }

  // Get service type by ID
  async getServiceTypeById(id) {
    try {
      return await ApiService.get(`/service-types/${id}`);
    } catch (error) {
      console.error(`Error fetching service type ${id}:`, error);
      throw error;
    }
  }

  // Create new service type
  async createServiceType(serviceTypeData) {
    try {
      return await ApiService.post('/service-types', serviceTypeData);
    } catch (error) {
      console.error('Error creating service type:', error);
      throw error;
    }
  }

  // Update service type
  async updateServiceType(id, serviceTypeData) {
    try {
      return await ApiService.patch(`/service-types/${id}`, serviceTypeData);
    } catch (error) {
      console.error(`Error updating service type ${id}:`, error);
      throw error;
    }
  }

  // Delete service type
  async deleteServiceType(id) {
    try {
      return await ApiService.delete(`/service-types/${id}`);
    } catch (error) {
      console.error(`Error deleting service type ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceTypeService();