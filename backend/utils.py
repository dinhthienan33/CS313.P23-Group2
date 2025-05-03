import os
import pickle
import numpy as np
import pandas as pd

def copy_model_file(source_path, dest_dir, file_name):
    """
    Copy a model file from source path to destination directory
    
    Args:
        source_path: Source path of the model file
        dest_dir: Destination directory
        file_name: Name of the file to create
        
    Returns:
        bool: Whether copy was successful
    """
    try:
        if not os.path.exists(source_path):
            print(f"Source file not found: {source_path}")
            return False
            
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, file_name)
        
        # Read from source and write to destination
        with open(source_path, 'rb') as src_file:
            model_data = src_file.read()
            
        with open(dest_path, 'wb') as dest_file:
            dest_file.write(model_data)
            
        print(f"Successfully copied model to {dest_path}")
        return True
        
    except Exception as e:
        print(f"Error copying model file: {e}")
        return False
        
def validate_input_data(data):
    """
    Validate input data for prediction
    
    Args:
        data: Input data for prediction
        
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = [
        "relativeCompactness",
        "wallArea",
        "roofArea",
        "overallHeight",
        "glazingArea",
        "glazingAreaDistribution"
    ]
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate data types and ranges
    validations = [
        ("relativeCompactness", 0.0, 1.0, float),
        ("wallArea", 0.0, 1000.0, float),
        ("roofArea", 0.0, 1000.0, float),
        ("overallHeight", 0.0, 100.0, float),
        ("glazingArea", 0.0, 1.0, float),
        ("glazingAreaDistribution", 0, 5, int)
    ]
    
    for field, min_val, max_val, field_type in validations:
        value = data.get(field)
        
        # Check type
        if not isinstance(value, field_type):
            try:
                # Try to convert
                if field_type == int:
                    value = int(value)
                else:
                    value = float(value)
                # Update the value
                data[field] = value
            except (ValueError, TypeError):
                return False, f"Field {field} must be a {field_type.__name__}"
        
        # Check range
        if value < min_val or value > max_val:
            return False, f"Field {field} must be between {min_val} and {max_val}"
    
    return True, "Valid input data" 