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
import { useLanguage } from '../../services/LanguageContext';

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
          {translations.modules.cost.title}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        {translations.modules.cost.description}
      </Typography>
      
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 4, backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
      >
        <Typography variant="h6" gutterBottom>
          {translations.modules.cost.totalCapacity}:
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#0277bd', mb: 1 }}
        >
          {(heatingLoad + coolingLoad).toFixed(2)} kW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {translations.results.heatingLoad} + {translations.results.coolingLoad}
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          {translations.modules.cost.yearlyUsage}:
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#0277bd', mb: 3 }}
        >
          {totalEnergy.toFixed(2)} kWh/year
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {translations.modules.cost.annualEnergyCost}:
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 'bold', color: '#e65100' }}
        >
          {formatNumber(Math.round(estimatedCost))} {translations.modules.cost.currency}/year
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        {translations.modules.cost.pricePerkWh}:
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 3 }}
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
            valueLabelFormat={(value) => `${value} ${translations.modules.cost.currency}`}
          />
        </Box>
        
        <TextField
          value={pricePerKwh}
          onChange={handlePriceInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{translations.modules.cost.currency}/kWh</InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '100%', sm: 190 } }}
        />
      </Stack>

      <Typography variant="h6" gutterBottom>
        {translations.modules.cost.hoursUsedPerDay}:
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
          sx={{ width: { xs: '100%', sm: 190 } }}
        />
      </Stack>
      

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {translations.modules.cost.monthlyCost}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1.5
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => {
              const month = index + 1;
            
              // Determine season
              let factor = 1.0;
              let bgColor = 'rgba(22, 241, 29, 0.1)';       // Spring/Fall (Green)
              let borderColor = 'rgba(81, 188, 134, 0.3)';
            
              if (month <= 2 || month >= 11) {
                factor = 1.2; // Winter
                bgColor = 'rgba(33, 150, 243, 0.1)';         // Blue
                borderColor = 'rgba(33, 150, 243, 0.3)';
              } else if (month >= 6 && month <= 8) {
                factor = 1.3; // Summer
                bgColor = 'rgba(255, 152, 0, 0.1)';          // Orange
                borderColor = 'rgba(255, 152, 0, 0.3)';
              }
            
              const monthlyCost = Math.round((estimatedCost / 12) * factor);
            
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 0.9, // tăng padding
                    textAlign: 'center',
                    borderRadius: 2,
                    backgroundColor: bgColor,
                    border: 1,
                    borderColor: borderColor,
                    minHeight: 90, // tăng chiều cao box,
                    minWidth: 90, // tăng chiều rộng box
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center', // căn giữa ngang
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    display="block" 
                    sx={{ mb: 1, fontSize: '0.95rem' }} // tăng cỡ chữ tháng
                  >
                    {`${translations.modules.cost.month} ${month}`}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.2rem' // tăng cỡ chữ số tiền
                    }}
                  >
                    {formatNumber(monthlyCost)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      

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