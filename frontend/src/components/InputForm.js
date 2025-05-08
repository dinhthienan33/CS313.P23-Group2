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
  CircularProgress,
  Typography
} from '@mui/material';
import { useLanguage } from '../services/LanguageContext';

const InputForm = ({ 
  onSubmit, 
  initialValues, 
  modelNames, 
  selectedModel, 
  onModelChange,
  isLoading 
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const { translations } = useLanguage();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert string values to numbers where appropriate
    const parsedValue = name !== 'glazingAreaDistribution' ? 
      parseFloat(value) : parseInt(value, 10);
    
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
        {/* Relative Compactness */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X1:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.relativeCompactness}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={translations.inputLabels.relativeCompactness}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X3:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.wallArea}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={translations.inputLabels.wallArea}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X4:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.roofArea}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={translations.inputLabels.roofArea}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X5:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.overallHeight}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={translations.inputLabels.overallHeight}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X7:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.glazingArea}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={translations.inputLabels.glazingArea}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mr: 1, fontWeight: 'bold' }}>
              X8:
            </Typography>
            <Typography variant="subtitle2">
              {translations.inputLabels.glazingAreaDistribution}
            </Typography>
          </Box>
          <FormControl fullWidth variant="outlined" disabled={isLoading}>
            <InputLabel id="glazing-distribution-label">
              {translations.inputLabels.glazingAreaDistribution}
            </InputLabel>
            <Select
              labelId="glazing-distribution-label"
              name="glazingAreaDistribution"
              value={formValues.glazingAreaDistribution}
              onChange={handleChange}
              label={translations.inputLabels.glazingAreaDistribution}
            >
              <MenuItem value={0}>0 - No glass</MenuItem>
              <MenuItem value={1}>1 - North</MenuItem>
              <MenuItem value={2}>2 - East</MenuItem>
              <MenuItem value={3}>3 - South</MenuItem>
              <MenuItem value={4}>4 - West</MenuItem>
              <MenuItem value={5}>5 - Uniform</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Model Selection and Submit Button */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} disabled={isLoading}>
            <InputLabel id="model-label">Model</InputLabel>
            <Select
              labelId="model-label"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              label="Model"
            >
              {modelNames.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {translations.buttons.submit}
          </Button>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setFormValues(initialValues)}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {translations.buttons.reset}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InputForm; 