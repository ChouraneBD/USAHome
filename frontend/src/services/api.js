// API Configuration and Base Service
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Don't set Content-Type for FormData - let browser handle it
    const isFormData = options.body instanceof FormData;

    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');

    const config = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    // For FormData (file uploads), use POST with method spoofing
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return this.request(endpoint, {
        method: 'POST',
        body: data,
      });
    }

    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request (for updates with FormData)
  async patch(endpoint, data) {
    // For FormData (file uploads), use POST with method spoofing
    if (data instanceof FormData) {
      data.append('_method', 'PATCH');
      return this.request(endpoint, {
        method: 'POST',
        body: data,
      });
    }

    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
