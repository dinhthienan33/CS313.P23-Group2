import React, { useState } from 'react';
import { 
  Button, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  CircularProgress
} from '@mui/material';

const InputForm = ({ 
  onSubmit, 
  initialValues, 
  modelNames, 
  selectedModel, 
  onModelChange,
  isLoading
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const cities = [
    "Bien Hoa (Southern)",
    "Cao Bang (Northern)",
    "Da Nang (Central)",
    "Haiphong (Northern)",
    "Hanoi (Northern)",
    "Ho Chi Minh City (Southern)",
    "Hue (Central)",
    "Qui Nhon (Central)"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert string values to numbers where appropriate
    const parsedValue = name !== 'glazingAreaDistribution' && name !== 'city'? 
      parseFloat(value) : name === 'glazingAreaDistribution' ? parseInt(value, 10) : value;
    
    setFormValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* City Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" disabled={isLoading}>
            <InputLabel id="city-selection-label">
              City
            </InputLabel>
            <Select
              labelId="city-selection-label"
              label="City"
              name="city"
              value={formValues.city || ''}
              onChange={handleChange}
              required
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Relative Compactness */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relative Compactness"
            name="relativeCompactness"
            type="number"
            value={formValues.relativeCompactness}
            onChange={handleChange}
            inputProps={{ 
              step: 0.01, 
              min: 0, 
              max: 1 
            }}
            required
            variant="outlined"
            disabled={isLoading}
          />
        </Grid>

        {/* Wall Area */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Wall Area (m²)"
            name="wallArea"
            type="number"
            value={formValues.wallArea}
            onChange={handleChange}
            inputProps={{ 
              step: 0.01, 
              min: 0 
            }}
            required
            variant="outlined"
            disabled={isLoading}
          />
        </Grid>

        {/* Roof Area */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Roof Area (m²)"
            name="roofArea"
            type="number"
            value={formValues.roofArea}
            onChange={handleChange}
            inputProps={{ 
              step: 0.01, 
              min: 0 
            }}
            required
            variant="outlined"
            disabled={isLoading}
          />
        </Grid>

        {/* Overall Height */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Overall Height (m)"
            name="overallHeight"
            type="number"
            value={formValues.overallHeight}
            onChange={handleChange}
            inputProps={{ 
              step: 0.01, 
              min: 0 
            }}
            required
            variant="outlined"
            disabled={isLoading}
          />
        </Grid>

        {/* Glazing Area */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Glazing Area (ratio)"
            name="glazingArea"
            type="number"
            value={formValues.glazingArea}
            onChange={handleChange}
            inputProps={{ 
              step: 0.01, 
              min: 0, 
              max: 1 
            }}
            required
            variant="outlined"
            helperText="Value between 0 and 1"
            disabled={isLoading}
          />
        </Grid>

        {/* Glazing Area Distribution */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" disabled={isLoading}>
            <InputLabel id="glazing-distribution-label">
              Glazing Area Distribution
            </InputLabel>
            <Select
              labelId="glazing-distribution-label"
              label="Glazing Area Distribution"
              name="glazingAreaDistribution"
              value={formValues.glazingAreaDistribution}
              onChange={handleChange}
              required
            >
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Model Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" disabled={isLoading}>
            <InputLabel id="model-selection-label">
              Prediction Model
            </InputLabel>
            <Select
              labelId="model-selection-label"
              label="Prediction Model"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {modelNames.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Generate Prediction'
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default InputForm; 