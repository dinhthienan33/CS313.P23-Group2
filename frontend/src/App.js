import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Paper,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import PredictionResult from './components/PredictionResult';
import HVACCalculator from './components/modules/HVACCalculator';
import CostEstimator from './components/modules/CostEstimator';
import CO2Calculator from './components/modules/CO2Calculator';
import SolarPanelCalculator from './components/modules/SolarPanelCalculator';
import EfficiencyClassifier from './components/modules/EfficiencyClassifier';
import apiService from './services/api';
import { LanguageProvider } from './services/LanguageContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#66bb6a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  // State variables
  const [currentModule, setCurrentModule] = useState('hvac');
  const [buildingParams, setBuildingParams] = useState({
    relativeCompactness: 0.98,
    wallArea: 294.00,
    roofArea: 110.25,
    overallHeight: 7.00,
    glazingArea: 0.0,
    glazingAreaDistribution: 0
  });
  const [predictionResults, setPredictionResults] = useState(null);
  const [selectedModel, setSelectedModel] = useState('XGBoost');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelNames, setModelNames] = useState([]);
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: 'Connecting to API...' });

  // Default models if API fails
  const defaultModels = [
    "Linear Regression",
    "Decision Tree",
    "Random Forest",
    "SVM",
    "XGBoost",
    "K-Nearest Neighbors"
  ];

  // Check API status and fetch models when component mounts
  useEffect(() => {
    const checkApiAndFetchModels = async () => {
      try {
        // Check API health
        const healthStatus = await apiService.getHealth();
        
        if (healthStatus.status === 'healthy') {
          setApiStatus({ 
            status: 'connected',
            message: 'Connected to API server'
          });
          
          // Get available models from API
          const models = await apiService.getAvailableModels();
          
          if (models && models.length > 0) {
            setModelNames(models);
            setSelectedModel(models[0]); // Select first model by default
          } else {
            setModelNames(defaultModels);
            setApiStatus({
              status: 'warning',
              message: 'Connected to API but no models available. Using default models.'
            });
          }
        } else {
          setApiStatus({
            status: 'warning',
            message: 'API connected but reporting unhealthy status. Using fallback calculations.'
          });
          setModelNames(defaultModels);
        }
      } catch (err) {
        console.error('Error connecting to API:', err);
        setApiStatus({
          status: 'error',
          message: 'Failed to connect to API server. Using mock predictions.'
        });
        setModelNames(defaultModels);
      }
    };
    
    checkApiAndFetchModels();
  }, []);

  // Handle sidebar module selection
  const handleModuleChange = (module) => {
    setCurrentModule(module);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setBuildingParams(formData);
    setIsFormSubmitted(true);
    
    try {
      // Get predictions from API
      const dataWithModel = {
        ...formData,
        model: selectedModel
      };
      
      const results = await apiService.getPredictions(dataWithModel);
      
      // Add selected model to results
      const updatedResults = {
        ...results,
        model: selectedModel
      };
      
      setPredictionResults(updatedResults);
    } catch (err) {
      console.error('Error getting predictions:', err);
      setError('Failed to get predictions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle model selection change - only store the selection, don't make predictions
  const handleModelChange = (model) => {
    setSelectedModel(model);
    // No longer automatically making predictions when model changes
  };

  // Render the current module component based on selection
  const renderModule = () => {
    if (!predictionResults) return null;

    const totalArea = buildingParams.wallArea + buildingParams.roofArea;
    const props = {
      heatingLoad: predictionResults.heatingLoad,
      coolingLoad: predictionResults.coolingLoad,
      area: totalArea
    };

    switch (currentModule) {
      case 'hvac':
        return <HVACCalculator {...props} />;
      case 'cost':
        return <CostEstimator {...props} />;
      case 'co2':
        return <CO2Calculator {...props} />;
      case 'solar':
        return <SolarPanelCalculator {...props} roofArea={buildingParams.roofArea} />;
      case 'efficiency':
        return <EfficiencyClassifier {...props} />;
      default:
        return <HVACCalculator {...props} />;
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          
          <Container sx={{ mt: 3, mb: 3, display: 'flex', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexGrow: 1, gap: 3 }}>
              {/* Sidebar */}
              <Box sx={{ width: 250 }}>
                <Sidebar 
                  currentModule={currentModule} 
                  onModuleChange={handleModuleChange} 
                />
              </Box>
              
              {/* Main content */}
              <Box sx={{ flexGrow: 1 }}>
                {/* API Status Alert */}
                {apiStatus.status !== 'connected' && (
                  <Alert 
                    severity={apiStatus.status === 'checking' ? 'info' : apiStatus.status} 
                    sx={{ mb: 3 }}
                  >
                    {apiStatus.message}
                  </Alert>
                )}
              
                <Paper 
                  elevation={3} 
                  sx={{ p: 3, mb: 3, borderRadius: 2 }}
                >
                  <Typography variant="h5" component="h2" gutterBottom>
                    🔶 Enter Building Parameters
                  </Typography>
                  <InputForm 
                    onSubmit={handleFormSubmit} 
                    initialValues={buildingParams}
                    modelNames={modelNames}
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                    isLoading={isLoading}
                  />
                </Paper>

                {isLoading && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      p: 3 
                    }}
                  >
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>
                      Processing prediction...
                    </Typography>
                  </Box>
                )}

                {error && (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 2,
                      backgroundColor: '#ffebee'
                    }}
                  >
                    <Typography color="error">
                      {error}
                    </Typography>
                  </Paper>
                )}

                {predictionResults && !isLoading && (
                  <>
                    <Paper 
                      elevation={3} 
                      sx={{ p: 3, mb: 3, borderRadius: 2 }}
                    >
                      <PredictionResult results={predictionResults} />
                    </Paper>
                    
                    <Paper 
                      elevation={3} 
                      sx={{ p: 3, borderRadius: 2 }}
                    >
                      {renderModule()}
                    </Paper>
                  </>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App; 