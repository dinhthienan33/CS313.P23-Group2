#!/usr/bin/env python3
"""
Run script for the Energy Efficiency Prediction API
This script:
1. Can initialize models for Docker builds
2. Can start the Flask API server
"""

import os
import sys
import argparse
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import make_pipeline
from xgboost import XGBRegressor
import importlib.util

def check_module_installed(module_name):
    """Check if a module is installed"""
    spec = importlib.util.find_spec(module_name)
    return spec is not None

def generate_models():
    """Generate models for Docker build"""
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    print("Generating models for Docker build...")
    
    # Sample data for training
    sample_data = [
        [0.98, 514.5, 294.0, 7.0, 0.0, 0],
        [0.98, 514.5, 294.0, 7.0, 0.0, 1],
        [0.98, 514.5, 294.0, 7.0, 0.0, 2],
        [0.98, 514.5, 294.0, 7.0, 0.0, 3],
        [0.98, 514.5, 294.0, 7.0, 0.0, 4],
        [0.98, 514.5, 294.0, 7.0, 0.0, 5],
        [0.98, 514.5, 294.0, 7.0, 0.1, 0],
        [0.98, 514.5, 294.0, 7.0, 0.1, 1],
        [0.98, 514.5, 294.0, 7.0, 0.1, 2],
        [0.98, 514.5, 294.0, 7.0, 0.1, 3],
        [0.98, 514.5, 294.0, 7.0, 0.1, 4],
        [0.98, 514.5, 294.0, 7.0, 0.1, 5],
        [0.98, 514.5, 294.0, 7.0, 0.2, 0],
        [0.9, 563.5, 318.5, 7.0, 0.0, 0],
        [0.9, 563.5, 318.5, 7.0, 0.0, 1],
        [0.9, 563.5, 318.5, 7.0, 0.0, 2],
        [0.9, 563.5, 318.5, 7.0, 0.0, 3],
        [0.9, 563.5, 318.5, 7.0, 0.0, 4],
        [0.9, 563.5, 318.5, 7.0, 0.0, 5],
        [0.9, 563.5, 318.5, 7.0, 0.1, 0],
    ]
    
    sample_heating_targets = [
        17.9, 21.0, 20.5, 21.5, 22.0, 22.5, 19.0, 22.0, 21.5, 22.5, 
        23.0, 23.5, 20.0, 19.9, 23.0, 22.5, 23.5, 24.0, 24.5, 21.0
    ]
    
    sample_cooling_targets = [
        15.0, 17.5, 18.0, 18.5, 19.0, 19.5, 16.0, 18.5, 19.0, 19.5,
        20.0, 20.5, 17.0, 17.0, 19.5, 20.0, 20.5, 21.0, 21.5, 18.0
    ]
    
    # Create column transformer
    df = pd.DataFrame(sample_data, columns=[
        "Relative Compactness", "Wall Area", "Roof Area", "Overall Height", 
        "Glazing Area", "Glazing Area Distribution"
    ])
    
    # Create scaler
    scaler = MinMaxScaler()
    scaler.fit(df)
    
    # Save transformer
    with open(os.path.join(MODEL_DIR, "col_transformer.pkl"), "wb") as f:
        pickle.dump(scaler, f)
    
    # Scale data
    X_scaled = scaler.transform(df)
    
    # Create models
    heating_models = {}
    cooling_models = {}
    
    # 1. Linear Regression
    lr_heating = LinearRegression()
    lr_heating.fit(X_scaled, sample_heating_targets)
    heating_models["Linear Regression"] = lr_heating
    
    lr_cooling = LinearRegression()
    lr_cooling.fit(X_scaled, sample_cooling_targets)
    cooling_models["Linear Regression"] = lr_cooling
    
    # 2. Decision Tree
    dt_heating = DecisionTreeRegressor(max_depth=3, random_state=42)
    dt_heating.fit(X_scaled, sample_heating_targets)
    heating_models["Decision Tree"] = dt_heating
    
    dt_cooling = DecisionTreeRegressor(max_depth=3, random_state=42)
    dt_cooling.fit(X_scaled, sample_cooling_targets)
    cooling_models["Decision Tree"] = dt_cooling
    
    # 3. Random Forest
    rf_heating = RandomForestRegressor(n_estimators=10, max_depth=3, random_state=42)
    rf_heating.fit(X_scaled, sample_heating_targets)
    heating_models["Random Forest"] = rf_heating
    
    rf_cooling = RandomForestRegressor(n_estimators=10, max_depth=3, random_state=42)
    rf_cooling.fit(X_scaled, sample_cooling_targets)
    cooling_models["Random Forest"] = rf_cooling
    
    # 4. SVM
    svm_heating = SVR(kernel='rbf', C=100, gamma=0.1)
    svm_heating.fit(X_scaled, sample_heating_targets)
    heating_models["SVM"] = svm_heating
    
    svm_cooling = SVR(kernel='rbf', C=100, gamma=0.1)
    svm_cooling.fit(X_scaled, sample_cooling_targets)
    cooling_models["SVM"] = svm_cooling
    
    # 5. XGBoost (if available)
    if check_module_installed("xgboost"):
        xgb_heating = XGBRegressor(n_estimators=10, max_depth=3, learning_rate=0.1)
        xgb_heating.fit(X_scaled, sample_heating_targets)
        heating_models["XGBoost"] = xgb_heating
        
        xgb_cooling = XGBRegressor(n_estimators=10, max_depth=3, learning_rate=0.1)
        xgb_cooling.fit(X_scaled, sample_cooling_targets)
        cooling_models["XGBoost"] = xgb_cooling
    
    # 6. K-Nearest Neighbors
    knn_heating = KNeighborsRegressor(n_neighbors=3)
    knn_heating.fit(X_scaled, sample_heating_targets)
    heating_models["K-Nearest Neighbors"] = knn_heating
    
    knn_cooling = KNeighborsRegressor(n_neighbors=3)
    knn_cooling.fit(X_scaled, sample_cooling_targets)
    cooling_models["K-Nearest Neighbors"] = knn_cooling
    
    # Save models
    with open(os.path.join(MODEL_DIR, "heating_AL.pkl"), "wb") as f:
        pickle.dump(heating_models, f)
    
    with open(os.path.join(MODEL_DIR, "cooling_AL.pkl"), "wb") as f:
        pickle.dump(cooling_models, f)
    
    print(f"Successfully generated models. Heating models: {list(heating_models.keys())}")
    print(f"Successfully generated models. Cooling models: {list(cooling_models.keys())}")
    
    return True

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Run Energy Efficiency API")
    parser.add_argument("--models-init", action="store_true", help="Initialize models for Docker build")
    parser.add_argument("--port", "-p", type=int, default=5000, help="Port to run the API server on")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind the API server to")
    parser.add_argument("--debug", action="store_true", help="Run in debug mode")
    
    args = parser.parse_args()
    
    # If models-init is specified, generate models and exit
    if args.models_init:
        success = generate_models()
        return 0 if success else 1
    
    # Otherwise, import app and run it
    from app import app, load_models
    
    # Load models
    loaded = load_models()
    if not loaded:
        print("Warning: Models could not be loaded. The API will use fallback calculations.")
    
    # Run the Flask app
    print(f"Starting API server on {args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=args.debug)

if __name__ == "__main__":
    sys.exit(main()) 