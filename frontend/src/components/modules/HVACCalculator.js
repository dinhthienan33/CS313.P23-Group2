import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Card, 
  CardContent 
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { useLanguage } from '../../services/LanguageContext';

const HVACCalculator = ({ heatingLoad, coolingLoad, area }) => {
  const { translations } = useLanguage();
  
  // The loads are already in kW, so we can use them directly
  const heatingPowerKw = heatingLoad;
  const coolingPowerKw = coolingLoad;
  
  // Calculate total system capacity based on building size
  const systemSizeHeating = (heatingPowerKw * area * 0.001).toFixed(2);
  const systemSizeCooling = (coolingPowerKw * area * 0.001).toFixed(2);
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          {translations.modules.hvac.title}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        {translations.modules.hvac.description}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 3 
        }}
      >
        {/* Heating Capacity */}
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.modules.hvac.heatingCapacity}
            </Typography>
            <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
              {heatingPowerKw.toFixed(2)} kW
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translations.modules.hvac.btuHeating}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                {translations.modules.hvac.systemCapacity}: {systemSizeHeating} MW
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        {/* Cooling Capacity */}
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.modules.hvac.coolingCapacity}
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {coolingPowerKw.toFixed(2)} kW
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translations.modules.hvac.btuCooling}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                {translations.modules.hvac.systemCapacity}: {systemSizeCooling} MW
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {translations.modules.hvac.recommendedHVAC}
        </Typography>
      </Box>
    </Box>
  );
};

export default HVACCalculator; 