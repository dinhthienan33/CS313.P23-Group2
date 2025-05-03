import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper, 
  Slider, 
  InputAdornment,
  TextField,
  Stack
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CostEstimator = ({ heatingLoad, coolingLoad, area }) => {
  // Default energy price in VND/kWh
  const [pricePerKwh, setPricePerKwh] = useState(3000);
  
  // Calculate total energy consumption and cost
  const totalEnergy = (heatingLoad + coolingLoad) * area; // kWh/year
  const estimatedCost = totalEnergy * pricePerKwh; // VND/year
  
  // Format number with commas as thousands separators
  const formatNumber = (number) => {
    return number.toLocaleString('en-US');
  };
  
  // Handle price slider change
  const handlePriceChange = (event, newValue) => {
    setPricePerKwh(newValue);
  };
  
  // Handle price input change
  const handlePriceInputChange = (event) => {
    const value = Number(event.target.value);
    if (isNaN(value)) return;
    
    if (value > 0 && value <= 10000) {
      setPricePerKwh(value);
    }
  };
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          Annual Energy Cost Estimation
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        Based on your building's characteristics, we've calculated the estimated 
        annual energy consumption and cost:
      </Typography>
      
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 4, backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
      >
        <Typography variant="h6" gutterBottom>
          Total Energy Consumption:
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#0277bd', mb: 3 }}
        >
          {totalEnergy.toFixed(2)} kWh/year
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Estimated Annual Cost:
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#e65100' }}
        >
          {formatNumber(Math.round(estimatedCost))} VND/year
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Adjust Electricity Price:
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Slider
            value={pricePerKwh}
            onChange={handlePriceChange}
            aria-labelledby="energy-price-slider"
            min={1000}
            max={6000}
            step={100}
            marks={[
              { value: 1000, label: '1,000' },
              { value: 3000, label: '3,000' },
              { value: 6000, label: '6,000' }
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} VND`}
          />
        </Box>
        
        <TextField
          value={pricePerKwh}
          onChange={handlePriceInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">VND/kWh</InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '100%', sm: 150 } }}
        />
      </Stack>
      
      <Typography variant="subtitle2" color="text.secondary" paragraph>
        * Calculations are based on the predicted heating load of {heatingLoad.toFixed(2)} kWh/m² 
        and cooling load of {coolingLoad.toFixed(2)} kWh/m², applied to your building's total area of {area.toFixed(2)} m².
      </Typography>
    </Box>
  );
};

export default CostEstimator; 