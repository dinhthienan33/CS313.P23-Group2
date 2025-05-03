#!/usr/bin/env python3
"""
Test script to directly load and test the models.
"""

import os
import pickle
import numpy as np
import pandas as pd

# Model directory
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

def test_models():
    """Test loading and using the models directly."""
    print("Testing models in:", MODEL_DIR)
    
    # List model files
    model_files = os.listdir(MODEL_DIR)
    print(f"Model files found: {model_files}")
    
    # Check for required files
    required_files = ["col_transformer.pkl", "heating_AL.pkl", "cooling_AL.pkl"]
    for required_file in required_files:
        if required_file not in model_files:
            print(f"ERROR: Required file {required_file} not found!")
            return False
    
    # Load column transformer
    try:
        print("\nLoading column transformer...")
        with open(os.path.join(MODEL_DIR, "col_transformer.pkl"), "rb") as f:
            transformer = pickle.load(f)
        print(f"Transformer loaded successfully: {type(transformer)}")
    except Exception as e:
        print(f"ERROR loading transformer: {e}")
        return False
    
    # Load heating models
    try:
        print("\nLoading heating models...")
        with open(os.path.join(MODEL_DIR, "heating_AL.pkl"), "rb") as f:
            heating_models = pickle.load(f)
        if not isinstance(heating_models, dict):
            print(f"ERROR: Heating models file does not contain a dictionary: {type(heating_models)}")
            return False
        print(f"Heating models loaded successfully: {list(heating_models.keys())}")
    except Exception as e:
        print(f"ERROR loading heating models: {e}")
        return False
    
    # Load cooling models
    try:
        print("\nLoading cooling models...")
        with open(os.path.join(MODEL_DIR, "cooling_AL.pkl"), "rb") as f:
            cooling_models = pickle.load(f)
        if not isinstance(cooling_models, dict):
            print(f"ERROR: Cooling models file does not contain a dictionary: {type(cooling_models)}")
            return False
        print(f"Cooling models loaded successfully: {list(cooling_models.keys())}")
    except Exception as e:
        print(f"ERROR loading cooling models: {e}")
        return False
    
    # Test data
    test_data = pd.DataFrame({
        "Relative Compactness": [0.98],
        "Wall Area": [294.0],
        "Roof Area": [110.25],
        "Overall Height": [7.0],
        "Glazing Area": [0.0],
        "Glazing Area Distribution": [0]
    })
    
    # Transform test data
    try:
        print("\nTransforming test data...")
        transformed_data = transformer.transform(test_data)
        print(f"Data transformed successfully: {transformed_data.shape}")
    except Exception as e:
        print(f"ERROR transforming data: {e}")
        return False
    
    # Test predictions for each model
    print("\nTesting predictions for each model:")
    for model_name in heating_models.keys():
        try:
            # Get models
            heating_model = heating_models[model_name]
            cooling_model = cooling_models[model_name]
            
            # Make predictions
            heating_prediction = heating_model.predict(transformed_data)[0]
            cooling_prediction = cooling_model.predict(transformed_data)[0]
            
            # Print results
            print(f"  - {model_name}:")
            print(f"      Heating Load: {heating_prediction:.2f}")
            print(f"      Cooling Load: {cooling_prediction:.2f}")
            
        except Exception as e:
            print(f"  - {model_name}: ERROR: {e}")
    
    return True

if __name__ == "__main__":
    test_models() 