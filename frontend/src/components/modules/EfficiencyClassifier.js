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
import { useLanguage } from '../../services/LanguageContext';

const EfficiencyClassifier = ({ heatingLoad, coolingLoad, area }) => {
  const { translations } = useLanguage();
  
  // Function to determine energy efficiency rating
  const getEfficiencyRating = () => {
    const totalLoad = heatingLoad + coolingLoad;
    
    if (totalLoad < 25) {
      return {
        rating: 'A',
        color: '#388e3c',
        description: 'High Efficiency',
        details: 'Excellent thermal performance with very low energy requirements.',
        percentage: 10
      };
    } else if (totalLoad <50) {
      return {
        rating: 'B',
        color: '#4caf50',
        description: 'Good Efficiency',
        details: 'Above-average thermal performance with low energy requirements.',
        percentage: 30
      };
    } else if (totalLoad < 75) {
      return {
        rating: 'C',
        color: '#8bc34a',
        description: 'Moderate Efficiency',
        details: 'Standard thermal performance with moderate energy requirements.',
        percentage: 50
      };
    } else if (totalLoad < 100) {
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
  
  // Generate improvement recommendations based on the rating using translations
  const getImprovementRecommendations = () => {
    const tips = translations.modules.efficiency.recommendationTips;
    
    if (rating.rating === 'A') {
      return [
        tips.maintain,
        tips.smartSystems
      ];
    } else if (rating.rating === 'B') {
      return [
        tips.insulation,
        tips.hvacUpgrade,
        tips.thermostats
      ];
    } else {
      return [
        tips.envelope,
        tips.windows,
        tips.ventilation,
        tips.equipment,
        tips.orientation
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
          {translations.modules.efficiency.title}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        {translations.modules.efficiency.description}
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
                  {translations.modules.efficiency.efficiencyScore}
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
                  <Typography variant="caption">{translations.modules.efficiency.classification}</Typography>
                  <Typography variant="caption">{translations.modules.efficiency.potentialUpgrade}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {translations.modules.efficiency.buildingRating}
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {translations.results.heatingLoad}
                  </Typography>
                  <Typography variant="h5">
                    {heatingLoad.toFixed(2)} kW
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {translations.results.coolingLoad}
                  </Typography>
                  <Typography variant="h5">
                    {coolingLoad.toFixed(2)} kW
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {translations.modules.efficiency.classification}
                  </Typography>
                  <Typography variant="h5" sx={{ color: rating.color, fontWeight: 'bold' }}>
                    {rating.rating}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {translations.modules.efficiency.efficiencyScore}
                  </Typography>
                  <Typography variant="h5">
                    {(100 - rating.percentage).toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          {translations.modules.efficiency.recommendations}
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <ul style={{ paddingLeft: '1.5rem', marginTop: 0, marginBottom: 0 }}>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  <Typography variant="body1" gutterBottom>
                    {rec}
                  </Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EfficiencyClassifier; 