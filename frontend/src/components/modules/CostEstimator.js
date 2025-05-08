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
import { useLanguage } from '../../services/LanguageContext';

const CostEstimator = ({ heatingLoad, coolingLoad, area }) => {
  const { translations } = useLanguage();
  
  // Default energy price in VND/kWh
  const [pricePerKwh, setPricePerKwh] = useState(3000);
  // Default operating hours per year
  const [hoursPerYear, setHoursPerYear] = useState(2000);
  
  // Calculate total energy consumption and cost
  // Convert kW (power) to kWh (energy) by multiplying by hours
  const totalEnergy = (heatingLoad + coolingLoad) * hoursPerYear; // kWh/year
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
    setHoursPerYear(newValue);
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
          {translations.modules.cost.heatingCost}:
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
          {translations.modules.cost.monthlyUsage}:
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
        {translations.modules.cost.costSaving}:
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
          sx={{ width: { xs: '100%', sm: 150 } }}
        />
      </Stack>

      <Typography variant="h6" gutterBottom>
        {translations.modules.cost.savingTips}:
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Slider
            value={hoursPerYear}
            onChange={handleHoursChange}
            aria-labelledby="operating-hours-slider"
            min={1000}
            max={8760}
            step={100}
            marks={[
              { value: 1000, label: '1,000' },
              { value: 4380, label: '4,380' },
              { value: 8760, label: '8,760' }
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} hrs`}
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
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {translations.modules.cost.monthlyUsage}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: 1 
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => {
              // Simple estimation for monthly variation
              const month = index + 1;
              const factor = month <= 2 || month >= 11 ? 1.2 : // Winter months
                            month >= 6 && month <= 8 ? 1.3 : // Summer months
                            1.0; // Spring/Fall
              
              const monthlyCost = Math.round((estimatedCost / 12) * factor);
              
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 1, 
                    textAlign: 'center',
                    borderRadius: 1,
                    backgroundColor: factor > 1.1 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                    border: 1,
                    borderColor: factor > 1.1 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)',
                  }}
                >
                  <Typography variant="caption" display="block">
                    {`${translations.modules.cost.month} ${month}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(monthlyCost)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
      
      <Typography variant="body2" color="text.secondary">
        * {translations.modules.cost.savingTips}: {translations.modules.cost.description}
      </Typography>
    </Box>
  );
};

export default CostEstimator; 