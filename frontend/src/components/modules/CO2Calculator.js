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
  LinearProgress
} from '@mui/material';
import Co2Icon from '@mui/icons-material/Co2';

const CO2Calculator = ({ heatingLoad, coolingLoad, area }) => {
  // Default emission factor in kg CO₂/kWh
  const [emissionFactor, setEmissionFactor] = useState(0.5);

  // Predefined emission factors for different regions/energy sources
  const emissionFactors = [
    { value: 0.2, label: 'Renewable Mix (0.2 kg CO₂/kWh)' },
    { value: 0.5, label: 'Average Grid (0.5 kg CO₂/kWh)' },
    { value: 0.8, label: 'Coal Dominant (0.8 kg CO₂/kWh)' },
    { value: 1.0, label: 'Oil/Diesel (1.0 kg CO₂/kWh)' }
  ];
  
  // Calculate total energy and emissions
  const totalEnergy = (heatingLoad + coolingLoad) * area; // kWh/year
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
          CO₂ Emissions Calculation
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        We've calculated your building's estimated carbon emissions based on its energy consumption:
      </Typography>
      
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
          Annual CO₂ Emissions
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
          kg CO₂ per year
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Carbon Intensity Rating
        </Typography>
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: ratingDetails.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {ratingDetails.rating}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  {ratingDetails.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(emissionsPerM2)} kg CO₂/m²/year
                </Typography>
              </Box>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={ratingDetails.percentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: ratingDetails.color
                }
              }} 
            />
          </CardContent>
        </Card>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Emission Factor Settings:
      </Typography>
      
      <Stack spacing={2} sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="emission-factor-label">Energy Source</InputLabel>
          <Select
            labelId="emission-factor-label"
            value={emissionFactor}
            label="Energy Source"
            onChange={(e) => setEmissionFactor(e.target.value)}
          >
            {emissionFactors.map((factor) => (
              <MenuItem key={factor.value} value={factor.value}>
                {factor.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Slider
          value={emissionFactor}
          onChange={(_, newValue) => setEmissionFactor(newValue)}
          min={0}
          max={1}
          step={0.1}
          marks={[
            { value: 0, label: '0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1.0' }
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} kg CO₂/kWh`}
        />
      </Stack>
      
      <Typography variant="subtitle2" color="text.secondary">
        * Calculations are based on total energy consumption of {totalEnergy.toFixed(2)} kWh/year
        and the selected emission factor of {emissionFactor} kg CO₂/kWh.
      </Typography>
    </Box>
  );
};

export default CO2Calculator; 