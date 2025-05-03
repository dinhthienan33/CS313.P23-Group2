#!/bin/bash

# Exit on error
set -e

# Show commands
set -x

# Check if models directory exists
if [ ! -d "models" ]; then
  mkdir -p models
  echo "Created models directory"
fi

# Check for model files
MODEL_FILES=("models/col_transformer.pkl" "models/heating_AL.pkl" "models/cooling_AL.pkl")
MISSING_FILES=0

for FILE in "${MODEL_FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "Warning: $FILE is missing"
    MISSING_FILES=1
  else
    echo "Found $FILE"
  fi
done

if [ $MISSING_FILES -eq 1 ]; then
  echo "Some model files are missing. The API will use fallback calculations."
  
  # Check if source models directory is provided
  if [ ! -z "$MODEL_SOURCE_DIR" ] && [ -d "$MODEL_SOURCE_DIR" ]; then
    echo "Attempting to set up models from $MODEL_SOURCE_DIR"
    python setup_models.py --source "$MODEL_SOURCE_DIR"
  fi
else
  echo "All model files are present"
fi

# Start the API server
if [ "$FLASK_ENV" = "development" ]; then
  echo "Starting development server"
  python app.py
else
  echo "Starting production server"
  gunicorn --bind 0.0.0.0:${PORT:-5000} wsgi:app
fi 