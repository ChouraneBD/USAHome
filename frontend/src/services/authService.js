import ApiService from './api';

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await ApiService.post('/register', userData);
      if (response.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await ApiService.post('/login', credentials);
      if (response.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await ApiService.get('/user');
      if (response.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await ApiService.post('/logout');
      // Clear stored data regardless of response
      this.clearStoredData();
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear stored data even if logout request fails
      this.clearStoredData();
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored user data
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Clear stored authentication data
  clearStoredData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();