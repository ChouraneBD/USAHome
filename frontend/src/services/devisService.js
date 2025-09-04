import ApiService from './api';

class DevisService {
  // Get all devis
  async getAllDevis() {
    try {
      return await ApiService.get('/devis');
    } catch (error) {
      console.error('Error fetching devis:', error);
      throw error;
    }
  }

  // Get devis by ID
  async getDevisById(id) {
    try {
      return await ApiService.get(`/devis/${id}`);
    } catch (error) {
      console.error(`Error fetching devis ${id}:`, error);
      throw error;
    }
  }

  // Create new devis
  async createDevis(devisData) {
    try {
      return await ApiService.post('/devis', devisData);
    } catch (error) {
      console.error('Error creating devis:', error);
      throw error;
    }
  }

  // Update devis
  async updateDevis(id, devisData) {
    try {
      return await ApiService.patch(`/devis/${id}`, devisData);
    } catch (error) {
      console.error(`Error updating devis ${id}:`, error);
      throw error;
    }
  }

  // Delete devis
  async deleteDevis(id) {
    try {
      return await ApiService.delete(`/devis/${id}`);
    } catch (error) {
      console.error(`Error deleting devis ${id}:`, error);
      throw error;
    }
  }

  // Get devis statistics
  async getDevisStatistics() {
    try {
      return await ApiService.get('/devis/statistics');
    } catch (error) {
      console.error('Error fetching devis statistics:', error);
      throw error;
    }
  }
}

export default new DevisService();