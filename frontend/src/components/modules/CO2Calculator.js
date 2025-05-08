import React, { useState, useEffect, useCallback } from 'react';
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
  InputAdornment,
  CircularProgress,
  Grid
} from '@mui/material';
import Co2Icon from '@mui/icons-material/Co2';
import { useLanguage } from '../../services/LanguageContext';
import apiService from '../../services/api';

const cityClimateData = {
  "Da Nang (Central)": { hdd: 666.7, cdd: 1049.7 },
  "Hanoi (Northern)": { hdd: 1709.6, cdd: 867.9 },
  "Ho Chi Minh City (Southern)": { hdd: 12.8, cdd: 1504.4 },
};

// Average values for normalization
const CDD_AVG = 1000;
const HDD_AVG = 800;

const CO2Calculator = ({ heatingLoad, coolingLoad, area, city }) => {
  const { translations } = useLanguage();
  
  // Default emission factor in kg CO₂/kWh
  const [emissionFactor, setEmissionFactor] = useState(0.5);
  
  // Default operating hours per year
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [debouncedHoursPerDay, setDebouncedHoursPerDay] = useState(24);
  const [hoursPerYear, setHoursPerYear] = useState(8760);

  // Add totalEnergy state
  const [totalEnergy, setTotalEnergy] = useState(0);

  const totalPower = heatingLoad + coolingLoad; // kW
  const totalEmission = totalEnergy * emissionFactor; // kg CO₂/year

  // Predefined emission factors for different regions/energy sources
  const emissionFactors = [
    { value: 0.2, label: 'Renewable Mix (0.2 kg CO₂/kWh)' },
    { value: 0.5, label: 'Average Grid (0.5 kg CO₂/kWh)' },
    { value: 0.8, label: 'Coal Dominant (0.8 kg CO₂/kWh)' },
    { value: 1.0, label: 'Oil/Diesel (1.0 kg CO₂/kWh)' }
  ];

  // Add this section to display the chart
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Implement debounce for the slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHoursPerDay(hoursPerDay);
      setHoursPerYear(hoursPerDay * 365);
    }, 700); // 1 second delay

    return () => clearTimeout(timer);
  }, [hoursPerDay]);

  // Modify fetchComparisonData to use the correct method
  const fetchComparisonData = async () => {
    if (!city || totalEmission <= 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the getCO2Comparison method instead of post
      const response = await apiService.getCO2Comparison({
        city: city,
        buildingCO2: Math.round(totalEmission) // Pass the building's CO2 emissions
      });
      
      // Check if the API call was successful
      if (response && response.success) {
        setComparisonData(response);
      } else {
        setError(response?.error || 'Failed to get comparison data');
      }
    } catch (err) {
      console.error('Error fetching CO2 comparison data:', err);
      setError('Failed to load comparison data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use useEffect to trigger fetchComparisonData when relevant values change
  useEffect(() => {
    if (totalEmission > 0 && city) {
      fetchComparisonData();
    }
  }, [totalEmission, city]);

  useEffect(() => {
    if (city && cityClimateData[city]) {
      const { hdd, cdd } = cityClimateData[city];
      // Base energy assuming 24/7 operation
      const baseEnergy = (coolingLoad * area * (cdd / CDD_AVG)) + (heatingLoad * area * (hdd / HDD_AVG));
      // Adjust based on actual hours used (assuming standard day is 24 hours)
      const adjustedEnergy = baseEnergy * (hoursPerYear / 8760);
      setTotalEnergy(adjustedEnergy);
    } else {
      // Fallback to original calculation if city data not available
      const totalPower = heatingLoad + coolingLoad; // kW
      setTotalEnergy(totalPower * hoursPerYear); // kWh/year
    }
  }, [heatingLoad, coolingLoad, area, city, hoursPerYear]);
  
  
  
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
    setHoursPerDay(newValue);
    // The actual hoursPerYear update is debounced
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

      {/* Operating hours and emission factor settings */}
      <Box sx={{ mb: 4 }}>
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
                  Operating Hours per Day: {hoursPerDay}, Operating Hours per Year: {hoursPerYear}
                </Typography>
                <Slider
                  value={hoursPerDay}
                  onChange={handleHoursChange}
                  aria-labelledby="hours-slider"
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 12, label: '12' },
                    { value: 24, label: '24' }
                  ]}
                  min={0}
                  max={24}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

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
          {translations.modules.co2.annualElectricity}:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {formatNumber(Math.round(totalEnergy))} kWh/year
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hoursPerYear} {translations.modules.co2.emission}
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Annual CO2 Emission - 30% width */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              backgroundColor: 'background.paper', 
              p: 3, 
              borderRadius: 2,
              textAlign: 'center',
              height: '100%',
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
        </Grid>
        
        {/* CO2 Comparison Chart - 70% width */}
        <Grid item xs={12} md={8}>
          <Card 
            variant="outlined"
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Comparison with Regional Average
              </Typography>
              
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : comparisonData ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Comparing your building with average home in {comparisonData.reference_city}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', height: '100%' }}>
                    {comparisonData.chart_image ? (
                      <img 
                        src={`data:image/png;base64,${comparisonData.chart_image}`} 
                        alt="CO2 Emissions Comparison" 
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    ) : (
                      <Box sx={{ mt: 2, height: '100%' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Your Building: {formatNumber(Math.round(comparisonData.building_co2))} kg CO₂/year
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          sx={{ 
                            height: 20, 
                            borderRadius: 1, 
                            mb: 2,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: ratingDetails.color
                            }
                          }} 
                        />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Average Building: {formatNumber(Math.round(comparisonData.avg_co2_per_house || 15000))} kg CO₂/year
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          sx={{ 
                            height: 20, 
                            borderRadius: 1,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#64b5f6'
                            }
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
                  <Typography>No comparison data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
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
    </Box>
  );
};

export default CO2Calculator; 