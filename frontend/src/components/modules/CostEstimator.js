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
  "Da Nang (Central)": { hdd: 666.7, cdd: 1049.7 },
  "Hanoi (Northern)": { hdd: 1709.6, cdd: 867.9 },
  "Ho Chi Minh City (Southern)": { hdd: 12.8, cdd: 1504.4 },
};

// Average values for normalization
const CDD_AVG = 1000;
const HDD_AVG = 800;

// Electricity price tiers (VND/kWh)
const electricityPriceTiers = [
  { maxKwh: 50, price: 1893 },
  { maxKwh: 100, price: 1956 },
  { maxKwh: 200, price: 2271 },
  { maxKwh: 300, price: 2860 },
  { maxKwh: 400, price: 3197 },
  { maxKwh: 401, price: 3500 }
];

const CostEstimator = ({ heatingLoad, coolingLoad, area, city }) => {
  // Default operating hours per day
  const [hoursPerDay, setHoursPerDay] = useState(8);
  // Default hours per year 
  const [hoursPerYear, setHoursPerYear] = useState(8760);
  const [totalEnergy, setTotalEnergy] = useState(0);
  
  // Calculate total energy consumption based on city climate data
  useEffect(() => {
    if (city && cityClimateData[city]) {
      const { hdd, cdd } = cityClimateData[city];
      // Base energy assuming 24/7 operation
      const baseEnergy = (coolingLoad * area * (cdd / CDD_AVG)) + (heatingLoad * area * (hdd / HDD_AVG));
      // Adjust based on actual hours used (assuming standard day is 24 hours)
      const adjustedEnergy = baseEnergy * (hoursPerDay / 24);
      setTotalEnergy(adjustedEnergy);
    } else {
      // Fallback to original calculation if city data not available
      setTotalEnergy((heatingLoad + coolingLoad) * area * (hoursPerYear / 8760));
    }
  }, [heatingLoad, coolingLoad, area, city, hoursPerDay, hoursPerYear]);
  
  // Calculate monthly energy consumption
  const monthlyEnergy = totalEnergy / 12;
  
  // Determine price per kWh based on monthly usage
  const getPricePerKwh = (monthlyKwh) => {
    for (const tier of electricityPriceTiers) {
      if (monthlyKwh <= tier.maxKwh) {
        return tier.price;
      }
    }
    return electricityPriceTiers[electricityPriceTiers.length - 1].price;
  };
  
  // Get the price tier description
  const getPriceTierDescription = (monthlyKwh) => {
    for (let i = 0; i < electricityPriceTiers.length; i++) {
      const tier = electricityPriceTiers[i];
      if (monthlyKwh <= tier.maxKwh) {
        if (i === 0) {
          return `0 - ${tier.maxKwh}kWh: ${tier.price} VND/kWh`;
        } else {
          const prevTier = electricityPriceTiers[i-1];
          return `${prevTier.maxKwh + 1} - ${tier.maxKwh}kWh: ${tier.price} VND/kWh`;
        }
      }
    }
    return `> 401kWh: ${electricityPriceTiers[electricityPriceTiers.length - 1].price} VND/kWh`;
  };
  
  const pricePerKwh = getPricePerKwh(monthlyEnergy);
  const priceTierDesc = getPriceTierDescription(monthlyEnergy);
  
  // Calculate cost
  const estimatedCost = totalEnergy * pricePerKwh; // VND/year
  
  // Format number with commas as thousands separators
  const formatNumber = (number) => {
    return number.toLocaleString('en-US');
  };
  
  // Handle hours slider change
  const handleHoursChange = (event, newValue) => {
    setHoursPerDay(newValue);
    setHoursPerYear(newValue*365);
  };
  
  // Handle hours input change
  const handleHoursInputChange = (event) => {
    const value = Number(event.target.value);
    if (isNaN(value)) return;
    
    if (value > 0 && value <= 8760) {
      setHoursPerYear(value);
      setHoursPerDay(Math.round(value/365));
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
          Estimated Annual Cost (average electricity used per month: {monthlyEnergy.toFixed(2)} kWh):
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#e65100' }}
        >
          {formatNumber(Math.round(estimatedCost))} VND/year
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Applied electricity rate: {priceTierDesc}
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Hours Used Per Day:
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Slider
            value={hoursPerDay}
            onChange={handleHoursChange}
            aria-labelledby="operating-hours-slider"
            min={0}
            max={24}
            step={1}
            marks={[
              { value: 0, label: '0' },
              { value: 12, label: '12' },
              { value: 24, label: '24' }
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} hours/day`}
          />
        </Box>
        
        <TextField
          value={hoursPerYear} 
          onChange={handleHoursInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">hours/year</InputAdornment>
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