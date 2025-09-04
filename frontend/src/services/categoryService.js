import ApiService from './api';

class CategoryService {
  // Get all categories
  async getAllCategories() {
    try {
      return await ApiService.get('/categories-produits');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      return await ApiService.get(`/categories-produits/${id}`);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      return await ApiService.post('/categories-produits', categoryData);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    try {
      return await ApiService.patch(`/categories-produits/${id}`, categoryData);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      return await ApiService.delete(`/categories-produits/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
}

export default new CategoryService();