import unittest
import json
import os
import sys

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, load_models

class EnergyEfficiencyAPITest(unittest.TestCase):
    """Test cases for the Energy Efficiency API"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True
        
    def test_health_endpoint(self):
        """Test health endpoint"""
        response = self.app.get('/health')
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('models_loaded', data)
        
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = self.app.get('/')
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('name', data)
        self.assertIn('version', data)
        self.assertIn('endpoints', data)
        
    def test_models_endpoint(self):
        """Test models endpoint"""
        response = self.app.get('/api/models')
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', data)
        
    def test_predict_endpoint_with_valid_data(self):
        """Test predict endpoint with valid data"""
        test_data = {
            "relativeCompactness": 0.98,
            "wallArea": 294.0,
            "roofArea": 110.25,
            "overallHeight": 7.0,
            "glazingArea": 0.0,
            "glazingAreaDistribution": 0
        }
        
        response = self.app.post(
            '/api/predict',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        self.assertIn('heatingLoad', data['data'])
        self.assertIn('coolingLoad', data['data'])
        
    def test_predict_endpoint_with_invalid_data(self):
        """Test predict endpoint with invalid data"""
        # Missing required field
        test_data = {
            "wallArea": 294.0,
            "roofArea": 110.25,
            "overallHeight": 7.0,
            "glazingArea": 0.0
        }
        
        response = self.app.post(
            '/api/predict',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main() 