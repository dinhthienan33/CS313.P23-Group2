import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Chip 
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useLanguage } from '../services/LanguageContext';

const PredictionResult = ({ results }) => {
  const { translations } = useLanguage();
  
  // Define color thresholds for visual indicators
  const getHeatingColor = (value) => {
    if (value < 15) return '#4caf50'; // green
    if (value < 25) return '#ff9800'; // orange
    return '#f44336'; // red
  };

  const getCoolingColor = (value) => {
    if (value < 15) return '#4caf50'; // green
    if (value < 25) return '#ff9800'; // orange
    return '#f44336'; // red
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
          🎯 {translations.results.title}
        </Typography>
        <Chip 
          label={results.model} 
          color="primary" 
          variant="outlined" 
          size="small" 
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3, 
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        {/* Heating Load */}
        <Box 
          sx={{ 
            textAlign: 'center',
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            width: { xs: '100%', sm: '45%' },
            backgroundColor: `${getHeatingColor(results.heatingLoad)}10` // 10% opacity
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <ThermostatIcon 
              sx={{ 
                fontSize: 40, 
                color: getHeatingColor(results.heatingLoad)
              }} 
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            {translations.results.heatingLoad} (Y1)
          </Typography>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: getHeatingColor(results.heatingLoad)
            }}
          >
            {results.heatingLoad.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            kW
          </Typography>
        </Box>

        {/* Cooling Load */}
        <Box 
          sx={{ 
            textAlign: 'center',
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            width: { xs: '100%', sm: '45%' },
            backgroundColor: `${getCoolingColor(results.coolingLoad)}10` // 10% opacity
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <AcUnitIcon 
              sx={{ 
                fontSize: 40, 
                color: getCoolingColor(results.coolingLoad)
              }} 
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            {translations.results.coolingLoad} (Y2)
          </Typography>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: getCoolingColor(results.coolingLoad)
            }}
          >
            {results.coolingLoad.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            kW
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PredictionResult; 