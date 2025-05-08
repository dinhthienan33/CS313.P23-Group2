# Energy Efficiency API

This is a Flask API server that provides predictions for building energy efficiency based on architectural parameters. The API uses pre-trained machine learning models to predict heating and cooling loads.

## Setup Instructions

### 1. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Prepare Models

Copy the model files to the `models` directory:
- col_transformer.pkl
- heating_AL.pkl
- cooling_AL.pkl

The API expects these specific model files to be present.


### 4. Run the Server

For development:
```bash
python app.py
```

For production:
```bash
gunicorn wsgi:app
```

Using the run script (with optional model directory):
```bash
python run.py --models /path/to/your/models --port 5000 --debug
```

### 5. Using Docker

Build and run the API server using Docker:

```bash
docker build -t energy-efficiency-api .
docker run -p 5000:5000 -v /path/to/your/models:/app/models energy-efficiency-api
```

Alternatively, use Docker Compose:

```bash
docker-compose up
```

## API Endpoints

### Root Endpoint
```
GET /
```
Returns basic API information and available endpoints.

### Health Check
```
GET /health
```
Returns the status of the API and whether models are loaded.

### Available Models
```
GET /api/models
```
Returns a list of available prediction models.

### Predict Energy Efficiency
```
POST /api/predict
```

**Request Body:**
```json
{
  "relativeCompactness": 0.98,
  "wallArea": 294.0,
  "roofArea": 110.25,
  "overallHeight": 7.0,
  "glazingArea": 0.0,
  "glazingAreaDistribution": 0,
  "model": "Linear Regression"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "heatingLoad": 17.5,
    "coolingLoad": 21.3
  },
  "input": {
    "relativeCompactness": 0.98,
    "wallArea": 294.0,
    "roofArea": 110.25,
    "overallHeight": 7.0,
    "glazingArea": 0.0,
    "glazingAreaDistribution": 0,
    "model": "Linear Regression"
  },
  "model_used": "Linear Regression"
}
```

## Available Models

The API supports the following models:
- Linear Regression
- Decision Tree
- Random Forest
- SVM
- XGBoost
- K-Nearest Neighbors

## Fallback Prediction

If the model files are not available, the API will use a simple fallback calculation to provide predictions. This is indicated in the response with a note.

## Running Tests

Run the unit tests:

```bash
python -m unittest discover tests
```

## Integration with React Frontend

This API server is designed to work with the Energy Efficiency React application. To connect the React app to this API, set the `REACT_APP_API_URL` environment variable in the React app to the URL of this API server:

```
REACT_APP_API_URL=http://localhost:5000/api
``` 