import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from utils import validate_input_data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

# Load models
models = {}

# Add a global variable to track if models were at least attempted to be loaded
model_load_attempted = False

def load_models():
    """Load models following the Streamlit app's approach"""
    global model_load_attempted
    model_load_attempted = True
    
    try:
        # Create models directory if it doesn't exist
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        # Print current directory and model directory for debugging
        print(f"Current working directory: {os.getcwd()}")
        print(f"MODEL_DIR: {MODEL_DIR}")
        print(f"Directory contents: {os.listdir(MODEL_DIR) if os.path.exists(MODEL_DIR) else 'Directory does not exist'}")
        
        # Check if model files exist
        col_transformer_path = os.path.join(MODEL_DIR, "col_transformer.pkl")
        heating_path = os.path.join(MODEL_DIR, "heating_AL.pkl")
        cooling_path = os.path.join(MODEL_DIR, "cooling_AL.pkl")
        
        print(f"Checking for model files: {os.path.exists(col_transformer_path)}, {os.path.exists(heating_path)}, {os.path.exists(cooling_path)}")
        
        if not (os.path.exists(col_transformer_path) and os.path.exists(heating_path) and os.path.exists(cooling_path)):
            print("Warning: Some model files are missing. Using fallback calculations.")
            return False
        
        # Load column transformer for preprocessing
        with open(col_transformer_path, "rb") as f:
            models["transformer"] = pickle.load(f)
        
        # Load heating models
        with open(heating_path, "rb") as f:
            models["heating"] = pickle.load(f)
        
        # Load cooling models
        with open(cooling_path, "rb") as f:
            models["cooling"] = pickle.load(f)
        
        # Check that the models contain all the expected model types
        model_types = [
            "Linear Regression",
            "Decision Tree",
            "Random Forest",
            "SVM",
            "XGBoost",
            "K-Nearest Neighbors"
        ]
        
        if not isinstance(models["heating"], dict) or not isinstance(models["cooling"], dict):
            print("Warning: Heating or cooling models are not in the expected format. Using fallback calculations.")
            return False
        
        # Print loaded models
        print(f"Loaded heating models: {list(models['heating'].keys())}")
        print(f"Loaded cooling models: {list(models['cooling'].keys())}")
        
        print("All models loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

def fallback_predict(input_data):
    """Fallback prediction function if models aren't available"""
    # Extract parameters
    relative_compactness = input_data.get("relativeCompactness", 0.98)
    wall_area = input_data.get("wallArea", 294.0)
    roof_area = input_data.get("roofArea", 110.25)
    overall_height = input_data.get("overallHeight", 7.0)
    glazing_area = input_data.get("glazingArea", 0.0)
    glazing_area_distribution = input_data.get("glazingAreaDistribution", 0)
    
    # Simple formula to simulate predictions (not a real model)
    heating_load = 10 + \
        (1 - relative_compactness) * 30 + \
        wall_area * 0.01 + \
        roof_area * 0.01 + \
        overall_height * 0.5 + \
        glazing_area * 10 + \
        glazing_area_distribution
        
    cooling_load = 15 + \
        (1 - relative_compactness) * 25 + \
        wall_area * 0.015 + \
        roof_area * 0.02 + \
        overall_height + \
        glazing_area * 15 + \
        glazing_area_distribution * 1.5
    
    return {
        "heatingLoad": round(heating_load, 2),
        "coolingLoad": round(cooling_load, 2)
    }

@app.route("/", methods=["GET"])
def root():
    """Root endpoint with basic API info"""
    loaded_status = bool(models and "transformer" in models)
    
    return jsonify({
        "name": "Energy Efficiency Prediction API",
        "version": "1.0.0",
        "description": "API for predicting heating and cooling loads of buildings",
        "status": {
            "models_loaded": loaded_status,
            "model_load_attempted": model_load_attempted,
            "using_fallback": not loaded_status and model_load_attempted
        },
        "endpoints": {
            "/health": "Check API health",
            "/api/models": "Get available prediction models",
            "/api/predict": "Make predictions"
        }
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    loaded_status = bool(models and "transformer" in models)
    
    return jsonify({
        "status": "healthy", 
        "models_loaded": loaded_status,
        "model_load_attempted": model_load_attempted,
        "using_fallback": not loaded_status and model_load_attempted,
        "api_version": "1.0.0"
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    """Make predictions using loaded models"""
    try:
        # Get data from request
        data = request.json
        
        # Validate input data
        is_valid, message = validate_input_data(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": message
            }), 400
        
        # If models aren't loaded, use fallback prediction
        if not models or "transformer" not in models or "heating" not in models or "cooling" not in models:
            print("Using fallback prediction because models aren't loaded")
            predictions = fallback_predict(data)
            return jsonify({
                "success": True,
                "data": predictions,
                "note": "Using fallback prediction (models not loaded)"
            })
        
        # Create DataFrame from input data
        input_df = pd.DataFrame({
            "Relative Compactness": [data.get("relativeCompactness", 0.98)],
            "Wall Area": [data.get("wallArea", 294.0)],
            "Roof Area": [data.get("roofArea", 110.25)],
            "Overall Height": [data.get("overallHeight", 7.0)],
            "Glazing Area": [data.get("glazingArea", 0.0)],
            "Glazing Area Distribution": [data.get("glazingAreaDistribution", 0)]
        })
        
        # Preprocess input data
        scaled_input = models["transformer"].transform(input_df)
        
        # Get model name if provided
        model_name = data.get("model", "Linear Regression")
        print(f"The choosen model is: {model_name}")
        # Get heating and cooling models
        heating_models = models["heating"]
        cooling_models = models["cooling"]
        
        # Check if the requested model exists
        if model_name not in heating_models or model_name not in cooling_models:
            # If requested model doesn't exist, use first available model
            available_models = list(heating_models.keys())
            if not available_models:
                print("No models available. Using fallback prediction.")
                predictions = fallback_predict(data)
                return jsonify({
                    "success": True,
                    "data": predictions,
                    "note": "Using fallback prediction (requested model not found)"
                })
            
            model_name = available_models[0]
            print(f"Requested model not found. Using {model_name} instead.")
        
        # Get heating model prediction
        heating_model = heating_models[model_name]
        heating_load = float(heating_model.predict(scaled_input)[0])
        
        # Get cooling model prediction
        cooling_model = cooling_models[model_name]
        cooling_load = float(cooling_model.predict(scaled_input)[0])
        
        # Return predictions
        return jsonify({
            "success": True,
            "data": {
                "heatingLoad": round(heating_load, 2),
                "coolingLoad": round(cooling_load, 2)
            },
            "input": data,
            "model_used": model_name
        })
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        # Try fallback prediction on error
        try:
            predictions = fallback_predict(request.json)
            return jsonify({
                "success": True,
                "data": predictions,
                "note": f"Using fallback prediction due to error: {str(e)}"
            })
        except Exception as fallback_error:
            return jsonify({
                "success": False,
                "error": str(e),
                "fallback_error": str(fallback_error)
            }), 500

@app.route("/api/models", methods=["GET"])
def get_available_models():
    """Return a list of available models"""
    if not models or "heating" not in models or not models["heating"]:
        return jsonify({
            "success": False,
            "error": "Models not loaded",
            "default_models": [
                "Linear Regression",
                "Decision Tree",
                "Random Forest",
                "SVM",
                "XGBoost",
                "K-Nearest Neighbors"
            ]
        })
    
    available_models = list(models["heating"].keys())
    
    return jsonify({
        "success": True,
        "models": available_models
    })

# Load models at startup
loaded = load_models()
if not loaded:
    print("Warning: Models could not be loaded. Using fallback calculations at startup.")
    
if __name__ == "__main__":
    # Run the Flask app
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True) 