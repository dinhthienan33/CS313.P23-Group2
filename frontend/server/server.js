const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock prediction function (in a real app, this would use the actual ML models)
const predictEnergy = (buildingParams) => {
  // This is just a simple mock prediction
  // In a real implementation, you would load your models and make predictions
  
  // Extract parameters
  const {
    relativeCompactness,
    wallArea,
    roofArea,
    overallHeight,
    glazingArea,
    glazingAreaDistribution
  } = buildingParams;
  
  // Simple formula to simulate predictions (not a real model)
  const heatingLoad = 10 + 
    (1 - relativeCompactness) * 30 + 
    wallArea * 0.01 + 
    roofArea * 0.01 + 
    overallHeight * 0.5 + 
    glazingArea * 10 + 
    glazingAreaDistribution;
    
  const coolingLoad = 15 + 
    (1 - relativeCompactness) * 25 + 
    wallArea * 0.015 + 
    roofArea * 0.02 + 
    overallHeight + 
    glazingArea * 15 + 
    glazingAreaDistribution * 1.5;
  
  return {
    heatingLoad: parseFloat(heatingLoad.toFixed(2)),
    coolingLoad: parseFloat(coolingLoad.toFixed(2))
  };
};

// API endpoints
app.post('/api/predict', (req, res) => {
  try {
    const buildingParams = req.body;
    const predictions = predictEnergy(buildingParams);
    
    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 