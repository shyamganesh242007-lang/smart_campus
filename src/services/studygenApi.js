import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI default port

export const studygenApi = {
  uploadPdf: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },
  
  askQuestion: async (question) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        question: question
      });
      return response.data;
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }
};
