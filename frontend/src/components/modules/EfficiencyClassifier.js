import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Card, 
  CardContent,
  LinearProgress,
  Grid 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const EfficiencyClassifier = ({ heatingLoad, coolingLoad, area }) => {
  // Function to determine energy efficiency rating
  const getEfficiencyRating = () => {
    const totalLoad = heatingLoad + coolingLoad;
    
    if (totalLoad < 20) {
      return {
        rating: 'A',
        color: '#388e3c',
        description: 'High Efficiency',
        details: 'Excellent thermal performance with very low energy requirements.',
        percentage: 10
      };
    } else if (totalLoad < 30) {
      return {
        rating: 'B',
        color: '#4caf50',
        description: 'Good Efficiency',
        details: 'Above-average thermal performance with low energy requirements.',
        percentage: 30
      };
    } else if (totalLoad < 40) {
      return {
        rating: 'C',
        color: '#8bc34a',
        description: 'Moderate Efficiency',
        details: 'Standard thermal performance with moderate energy requirements.',
        percentage: 50
      };
    } else if (totalLoad < 50) {
      return {
        rating: 'D',
        color: '#ffc107',
        description: 'Below Average',
        details: 'Poor thermal performance with high energy requirements.',
        percentage: 70
      };
    } else {
      return {
        rating: 'E',
        color: '#f44336',
        description: 'Low Efficiency',
        details: 'Very poor thermal performance with very high energy requirements.',
        percentage: 90
      };
    }
  };
  
  // Get the rating based on the loads
  const rating = getEfficiencyRating();
  
  // Calculate total energy consumption
  const totalEnergy = (heatingLoad + coolingLoad) * area; // kWh/year
  
  // Generate improvement recommendations based on the rating
  const getImprovementRecommendations = () => {
    if (rating.rating === 'A') {
      return [
        'Maintain current systems and consider renewable energy sources',
        'Implement smart building management systems for further optimization'
      ];
    } else if (rating.rating === 'B') {
      return [
        'Improve wall and roof insulation',
        'Upgrade to more efficient HVAC systems',
        'Consider smart thermostats and zoning'
      ];
    } else {
      return [
        'Significantly improve building envelope insulation',
        'Replace windows with high-performance glazing',
        'Install energy recovery ventilation systems',
        'Upgrade to high-efficiency HVAC equipment',
        'Consider building orientation and shading for future designs'
      ];
    }
  };
  
  const recommendations = getImprovementRecommendations();
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          Building Efficiency Classification
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        Based on the predicted heating and cooling loads, your building has been 
        classified with the following energy efficiency rating:
      </Typography>
      
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 4,
          backgroundColor: `${rating.color}10`,
          borderColor: rating.color,
          borderWidth: 2
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
              <Box 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  backgroundColor: rating.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  border: '4px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '4rem'
                  }}
                >
                  {rating.rating}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: rating.color,
                  mb: 1
                }}
              >
                {rating.description}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {rating.details}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Energy Performance
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={rating.percentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: rating.color
                    }
                  }} 
                />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between' 
                  }}
                >
                  <Typography variant="caption">Highest Efficiency</Typography>
                  <Typography variant="caption">Lowest Efficiency</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Typography variant="h6" gutterBottom>
        Building Performance Summary
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Heating Load
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              {heatingLoad.toFixed(2)} kWh/m²
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cooling Load
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              {coolingLoad.toFixed(2)} kWh/m²
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Energy
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              {totalEnergy.toFixed(2)} kWh/year
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="h6" gutterBottom>
        Improvement Recommendations
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
            {recommendations.map((recommendation, index) => (
              <li key={index}>
                <Typography variant="body1" paragraph={index < recommendations.length - 1}>
                  {recommendation}
                </Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EfficiencyClassifier; 