import React, { useState, useEffect } from 'react';
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

// City climate data from the CSV
const cityClimateData = {
  "Bien Hoa (Southern)": { hdd: 12.8, cdd: 1504.4 },
  "Cao Bang (Northern)": { hdd: 2623.5, cdd: 333.9 },
  "Da Nang (Central)": { hdd: 666.7, cdd: 1049.7 },
  "Haiphong (Northern)": { hdd: 1955.9, cdd: 558.6 },
  "Hanoi (Northern)": { hdd: 1709.6, cdd: 867.9 },
  "Ho Chi Minh City (Southern)": { hdd: 12.8, cdd: 1504.4 },
  "Hue (Central)": { hdd: 1036.6, cdd: 998.2 },
  "Qui Nhon (Central)": { hdd: 329.8, cdd: 1203.0 }
};

// Average values for normalization
const CDD_AVG = 1000;
const HDD_AVG = 800;

const CostEstimator = ({ heatingLoad, coolingLoad, area, city }) => {
  // Default energy price in VND/kWh
  const [pricePerKwh, setPricePerKwh] = useState(3000);
  const [totalEnergy, setTotalEnergy] = useState(0);
  
  // Calculate total energy consumption based on city climate data
  useEffect(() => {
    if (city && cityClimateData[city]) {
      const { hdd, cdd } = cityClimateData[city];
      const energy = (coolingLoad * area * (cdd / CDD_AVG)) + (heatingLoad * area * (hdd / HDD_AVG));
      setTotalEnergy(energy);
    } else {
      // Fallback to original calculation if city data not available
      setTotalEnergy((heatingLoad + coolingLoad) * area);
    }
  }, [heatingLoad, coolingLoad, area, city]);
  
  // Calculate cost
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
        {city && cityClimateData[city] && (
          <> Energy adjusted for climate data: {city} (HDD: {cityClimateData[city].hdd}, CDD: {cityClimateData[city].cdd}).</>
        )}
      </Typography>
    </Box>
  );
};

export default CostEstimator; 