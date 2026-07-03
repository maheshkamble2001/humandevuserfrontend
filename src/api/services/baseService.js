// src/api/services/baseService.js
import apiClient from '../client';

class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // GET request
  async get(url, params = {}) {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST request
  async post(url, data = {}) {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT request
  async put(url, data = {}) {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH request
  async patch(url, data = {}) {
    try {
      const response = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE request
  async delete(url) {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // CRUD operations
  async getAll(params = {}) {
    return this.get(this.endpoint, params);
  }

  async getById(id) {
    return this.get(`${this.endpoint}/${id}`);
  }

  async create(data) {
    return this.post(this.endpoint, data);
  }

  async update(id, data) {
    return this.put(`${this.endpoint}/${id}`, data);
  }

  async deleteById(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  // Error handler
  handleError(error) {
    const message = error.response?.data?.error || 
                    error.response?.data?.message || 
                    error.message || 
                    'An error occurred';
    const status = error.response?.status;
    const data = error.response?.data;
    
    return {
      message,
      status,
      data,
      originalError: error,
    };
  }
}

// ✅ Export as default
export default BaseService;