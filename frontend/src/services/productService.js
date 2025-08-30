import ApiService from './api';

class ProductService {
  // Get all products
  async getAllProducts() {
    try {
      return await ApiService.get('/produits');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      return await ApiService.get(`/produits/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      return await ApiService.post('/produits', productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, productData) {
    try {
      return await ApiService.patch(`/produits/${id}`, productData);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      return await ApiService.delete(`/produits/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // Get product categories
  async getCategories() {
    try {
      return await ApiService.get('/categories-produits');
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  }
}

export default new ProductService();
