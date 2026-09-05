import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? `http://${window.location.hostname}:8000`
  : 'http://127.0.0.1:8000'; // Direct loopback to avoid IPv6 DNS timeout

export const studygenApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Do not manually set Content-Type header so Axios/browser automatically sets the multipart boundary
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      let errMsg = 'Upload failed';
      if (error.response?.data?.error) {
        errMsg = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errMsg = typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail);
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errMsg = 'Backend server not reachable. Ensure the server is running on http://127.0.0.1:8000.';
      } else if (error.message) {
        errMsg = error.message;
      }
      return { success: false, error: errMsg };
    }
  },

  // Alias for backward compatibility
  uploadPdf: async (file) => {
    return studygenApi.uploadFile(file);
  },

  checkHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  },

  getActiveFiles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('Error fetching active files:', error);
      return { success: false, files: [] };
    }
  },

  deleteFile: async (filename) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/delete`, { filename }, { timeout: 15000 });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  askQuestion: async (question) => {
    try {
      const payload = { question: String(question).trim() };
      const response = await axios.post(`${API_BASE_URL}/chat`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error asking question:', error);
      let errMsg = 'Query failed';
      if (error.response?.data?.error) {
        errMsg = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errMsg = typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail);
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errMsg = 'Backend server not reachable on http://127.0.0.1:8000.';
      } else if (error.message) {
        errMsg = error.message;
      }
      throw new Error(errMsg);
    }
  }
};
