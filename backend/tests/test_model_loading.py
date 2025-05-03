import unittest
import os
import sys
import json

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, load_models, models

class ModelLoadingTest(unittest.TestCase):
    """Test cases for model loading"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True
        
        # Clear existing models
        models.clear()
    
    def test_model_loading(self):
        """Test that models load correctly"""
        # Load models
        result = load_models()
        
        # Check that models loaded successfully
        self.assertTrue(result, "Model loading should return True")
        
        # Check that models dictionary has expected keys
        self.assertIn("transformer", models, "Column transformer should be loaded")
        self.assertIn("heating", models, "Heating models should be loaded")
        self.assertIn("cooling", models, "Cooling models should be loaded")
        
        # Check that heating and cooling models are loaded
        self.assertTrue(len(models["heating"]) > 0, "At least one heating model should be loaded")
        self.assertTrue(len(models["cooling"]) > 0, "At least one cooling model should be loaded")
        
        # Print loaded models for debugging
        print("Loaded models:")
        for model_type in ["heating", "cooling"]:
            print(f"  {model_type.capitalize()} models:")
            for name, _ in models[model_type]:
                print(f"    - {name}")
    
    def test_models_endpoint(self):
        """Test the /api/models endpoint"""
        # Load models first
        load_models()
        
        # Call the endpoint
        response = self.app.get('/api/models')
        data = json.loads(response.data)
        
        # Check response
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn('models', data)
        self.assertTrue(len(data['models']) > 0, "At least one model should be available")
        
        # Print available models
        print("Available models from API endpoint:")
        for model in data['models']:
            print(f"  - {model}")
    
    def test_prediction_with_different_models(self):
        """Test predictions with different models"""
        # Load models first
        load_models()
        
        # Get available models
        response = self.app.get('/api/models')
        models_data = json.loads(response.data)
        
        if not models_data['success']:
            self.skipTest("Models not available")
        
        available_models = models_data['models']
        
        # Test data
        test_data = {
            "relativeCompactness": 0.98,
            "wallArea": 294.0,
            "roofArea": 110.25,
            "overallHeight": 7.0,
            "glazingArea": 0.0,
            "glazingAreaDistribution": 0
        }
        
        # Test each model
        for model_name in available_models:
            # Add model to test data
            test_data_with_model = test_data.copy()
            test_data_with_model["model"] = model_name
            
            # Call the predict endpoint
            response = self.app.post(
                '/api/predict',
                data=json.dumps(test_data_with_model),
                content_type='application/json'
            )
            
            # Check response
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 200, f"Prediction with model {model_name} failed")
            self.assertTrue(data['success'], f"Prediction with model {model_name} was not successful")
            self.assertIn('data', data)
            self.assertIn('heatingLoad', data['data'])
            self.assertIn('coolingLoad', data['data'])
            self.assertEqual(data['model_used'], model_name, f"Used model should be {model_name}")
            
            # Print prediction results
            print(f"Prediction with model {model_name}:")
            print(f"  Heating Load: {data['data']['heatingLoad']}")
            print(f"  Cooling Load: {data['data']['coolingLoad']}")

if __name__ == '__main__':
    unittest.main() 