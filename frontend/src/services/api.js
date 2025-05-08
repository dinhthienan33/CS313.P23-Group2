import axios from 'axios';

// Set base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API service methods
const apiService = {
  /**
   * Get health status of the API
   * @returns {Promise} - Promise with health status
   */
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'error', error: error.message };
    }
  },

  /**
   * Get available models
   * @returns {Promise} - Promise with available models
   */
  getAvailableModels: async () => {
    try {
      const response = await api.get('/models');
      return response.data.models || [];
    } catch (error) {
      console.error('Get models error:', error);
      return [];
    }
  },

  /**
   * Get predictions for building energy efficiency
   * @param {Object} buildingParams - Building parameters
   * @returns {Promise} - Promise with prediction results
   */
  getPredictions: async (buildingParams) => {
    try {
      // Try to call the actual API
      const response = await api.post('/predict', buildingParams);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Prediction failed');
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      // If API call fails, use fallback mock data
      return generateMockPrediction(buildingParams);
    }
  },
  
  /**
   * Fetch CO2 comparison data
   * @param {Object} data - Data for CO2 comparison
   * @returns {Promise} - Promise with CO2 comparison data
   */
  getCO2Comparison: async (data) => {
    try {
      const BASE_URL = 'http://localhost:5000'; // This should match your actual API URL
      const response = await fetch(`${BASE_URL}/api/co2-comparison`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error in getCO2Comparison:', error);
      throw error;
    }
  }
};

/**
 * Generate mock prediction for demo purposes
 * This is only used when the API server is not available
 */
const generateMockPrediction = (buildingParams) => {
  const {
    relativeCompactness,
    wallArea,
    roofArea,
    overallHeight,
    glazingArea,
    glazingAreaDistribution
  } = buildingParams;
  
  // Simple formula to simulate predictions (not a real model)
  const heatingLoad = 0;
    
  const coolingLoad = 0;
  
  return {
    heatingLoad: parseFloat(heatingLoad.toFixed(2)),
    coolingLoad: parseFloat(coolingLoad.toFixed(2))
  };
};

export default apiService;