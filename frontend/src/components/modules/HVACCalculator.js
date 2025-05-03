import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Card, 
  CardContent 
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';

const HVACCalculator = ({ heatingLoad, coolingLoad, area }) => {
  // Calculate HVAC capacity requirements
  const hoursPerYear = 1000;
  const heatingPowerKw = (heatingLoad * area) / hoursPerYear;
  const coolingPowerKw = (coolingLoad * area) / hoursPerYear;
  
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
          HVAC System Capacity
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Based on your building parameters and the predicted energy loads, here's the 
        recommended HVAC system capacity for efficient operation:
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
              Heating System
            </Typography>
            <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
              {heatingPowerKw.toFixed(2)} kW
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recommended heating capacity
            </Typography>
          </CardContent>
        </Card>
        
        {/* Cooling Capacity */}
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cooling System
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {coolingPowerKw.toFixed(2)} kW
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recommended cooling capacity
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Note: These calculations assume {hoursPerYear} operational hours per year. 
          Adjust as needed based on your specific usage patterns.
        </Typography>
      </Box>
    </Box>
  );
};

export default HVACCalculator; 