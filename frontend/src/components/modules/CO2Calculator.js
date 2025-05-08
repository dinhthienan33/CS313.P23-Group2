import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Card, 
  CardContent, 
  Slider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import Co2Icon from '@mui/icons-material/Co2';
import { useLanguage } from '../../services/LanguageContext';

const CO2Calculator = ({ heatingLoad, coolingLoad, area }) => {
  const { translations } = useLanguage();
  
  // Default emission factor in kg CO₂/kWh
  const [emissionFactor, setEmissionFactor] = useState(0.5);
  
  // Default operating hours per year
  const [hoursPerYear, setHoursPerYear] = useState(2000);

  // Predefined emission factors for different regions/energy sources
  const emissionFactors = [
    { value: 0.2, label: 'Renewable Mix (0.2 kg CO₂/kWh)' },
    { value: 0.5, label: 'Average Grid (0.5 kg CO₂/kWh)' },
    { value: 0.8, label: 'Coal Dominant (0.8 kg CO₂/kWh)' },
    { value: 1.0, label: 'Oil/Diesel (1.0 kg CO₂/kWh)' }
  ];
  
  // Calculate total energy and emissions
  // Convert from kW (power) to kWh (energy) by multiplying by hours
  const totalPower = heatingLoad + coolingLoad; // kW
  const totalEnergy = totalPower * hoursPerYear; // kWh/year
  const totalEmission = totalEnergy * emissionFactor; // kg CO₂/year
  
  // Calculate carbon intensity rating (based on emissions per m²)
  const emissionsPerM2 = totalEmission / area;
  
  const getRatingDetails = () => {
    if (emissionsPerM2 < 30) {
      return { 
        rating: 'A+', 
        color: '#388e3c',
        text: 'Very Low Carbon',
        percentage: 10
      };
    } else if (emissionsPerM2 < 50) {
      return { 
        rating: 'A', 
        color: '#4caf50',
        text: 'Low Carbon', 
        percentage: 25
      };
    } else if (emissionsPerM2 < 70) {
      return { 
        rating: 'B', 
        color: '#8bc34a',
        text: 'Below Average', 
        percentage: 40
      };
    } else if (emissionsPerM2 < 90) {
      return { 
        rating: 'C', 
        color: '#ffc107',
        text: 'Average', 
        percentage: 55
      };
    } else if (emissionsPerM2 < 120) {
      return { 
        rating: 'D', 
        color: '#ff9800',
        text: 'Above Average', 
        percentage: 70
      };
    } else if (emissionsPerM2 < 150) {
      return { 
        rating: 'E', 
        color: '#ff5722',
        text: 'High Carbon', 
        percentage: 85
      };
    } else {
      return { 
        rating: 'F', 
        color: '#f44336',
        text: 'Very High Carbon', 
        percentage: 100
      };
    }
  };
  
  const ratingDetails = getRatingDetails();
  
  // Format large numbers with thousands separators
  const formatNumber = (number) => {
    return number.toLocaleString('en-US');
  };

  // Handle hours slider change
  const handleHoursChange = (event, newValue) => {
    setHoursPerYear(newValue);
  };
  
  // Get carbon tip translations
  const carbonTips = translations.modules.co2.carbonTips;
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <Co2Icon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          {translations.modules.co2.title}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        {translations.modules.co2.description}
      </Typography>

      <Box 
        sx={{ 
          backgroundColor: 'background.paper', 
          p: 2, 
          borderRadius: 2,
          mb: 3,
          boxShadow: 1
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          {translations.modules.co2.heatingEmissions}:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {totalPower.toFixed(2)} kW
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {translations.results.heatingLoad} ({heatingLoad.toFixed(2)} kW) + {translations.results.coolingLoad} ({coolingLoad.toFixed(2)} kW)
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          {translations.modules.co2.annualEmissions}:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {formatNumber(Math.round(totalEnergy))} kWh/year
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hoursPerYear} {translations.modules.co2.emission}
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          backgroundColor: 'background.paper', 
          p: 3, 
          borderRadius: 2,
          textAlign: 'center',
          mb: 4,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" gutterBottom>
          {translations.modules.co2.annualEmissions}
        </Typography>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: ratingDetails.color,
            my: 2
          }}
        >
          {formatNumber(Math.round(totalEmission))}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          kg CO₂ {translations.modules.co2.emission}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {translations.modules.co2.equivalent}
        </Typography>
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: ratingDetails.color,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  mr: 2
                }}
              >
                {ratingDetails.rating}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {ratingDetails.text}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={ratingDetails.percentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5, 
                    mt: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: ratingDetails.color
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {emissionsPerM2.toFixed(1)} kg CO₂/m² per year
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {Math.round(totalEmission / 21)} {translations.modules.co2.trees}
            </Typography>
            <Typography variant="body1">
              {formatNumber(Math.round(totalEmission * 2.5))} {translations.modules.co2.driving}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {translations.modules.co2.tips}
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" paragraph>
              • {carbonTips.thermostats}
            </Typography>
            <Typography variant="body2" paragraph>
              • {carbonTips.insulation}
            </Typography>
            <Typography variant="body2" paragraph>
              • {carbonTips.renewable}
            </Typography>
            <Typography variant="body2">
              • {carbonTips.lighting}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          {translations.modules.co2.emission}
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="emission-factor-label">Emission Factor</InputLabel>
                  <Select
                    labelId="emission-factor-label"
                    value={emissionFactor}
                    label="Emission Factor"
                    onChange={(e) => setEmissionFactor(e.target.value)}
                  >
                    {emissionFactors.map((factor) => (
                      <MenuItem key={factor.value} value={factor.value}>
                        {factor.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <Typography id="hours-slider" gutterBottom>
                  Operating Hours per Year: {hoursPerYear}
                </Typography>
                <Slider
                  value={hoursPerYear}
                  onChange={handleHoursChange}
                  aria-labelledby="hours-slider"
                  step={100}
                  marks
                  min={1000}
                  max={8760}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CO2Calculator; 