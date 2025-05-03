import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Slider,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

const SolarPanelCalculator = ({ heatingLoad, coolingLoad, area }) => {
  // Default solar panel output in Watts
  const [panelWattage, setPanelWattage] = useState(350);
  
  // Default solar panel efficiency
  const [sunshineHours, setSunshineHours] = useState(4);
  
  // Calculate total energy consumption
  const totalEnergy = (heatingLoad + coolingLoad) * area; // kWh/year
  
  // Daily energy consumption
  const dailyEnergy = totalEnergy / 365; // kWh/day
  
  // Calculate required solar panels
  const dailyOutputPerPanel = (panelWattage * sunshineHours) / 1000; // kWh/day/panel
  const requiredPanels = Math.ceil(dailyEnergy / dailyOutputPerPanel);
  
  // Estimate area required for panels (assuming ~1.7 m² per panel)
  const areaRequired = requiredPanels * 1.7;
  
  // Estimate cost (assuming ~$250 per panel plus $2000 installation)
  const estimatedCost = (requiredPanels * 250) + 2000;
  
  // Estimate annual savings
  const annualSavings = totalEnergy * 0.15; // Assuming $0.15/kWh
  
  // Calculate payback period
  const paybackYears = estimatedCost / annualSavings;
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <WbSunnyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          Solar Panel Recommendation
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" paragraph>
        Based on your building's energy consumption, we've calculated the solar panel 
        system you would need to offset your energy usage:
      </Typography>
      
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: 'rgba(66, 165, 245, 0.1)', 
          borderRadius: 2,
          mb: 4
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SolarPowerIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Recommended System
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {requiredPanels}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Solar Panels
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(requiredPanels * panelWattage / 1000).toFixed(1)} kW total capacity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Installation Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Roof Area Required:</strong> {areaRequired.toFixed(1)} m²
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estimated Cost:</strong> ${estimatedCost.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Annual Savings:</strong> ${annualSavings.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payback Period:</strong> {paybackYears.toFixed(1)} years
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Based on standard installation costs and local energy prices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Customize Your Calculation:
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography id="panel-wattage-slider" gutterBottom>
            Solar Panel Wattage: {panelWattage}W
          </Typography>
          <Slider
            value={panelWattage}
            onChange={(_, newValue) => setPanelWattage(newValue)}
            aria-labelledby="panel-wattage-slider"
            min={250}
            max={500}
            step={10}
            marks={[
              { value: 250, label: '250W' },
              { value: 350, label: '350W' },
              { value: 500, label: '500W' }
            ]}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="sunshine-hours-label">Daily Sunshine Hours</InputLabel>
            <Select
              labelId="sunshine-hours-label"
              value={sunshineHours}
              label="Daily Sunshine Hours"
              onChange={(e) => setSunshineHours(e.target.value)}
            >
              <MenuItem value={3}>3 hours (Low sunlight region)</MenuItem>
              <MenuItem value={4}>4 hours (Moderate sunlight)</MenuItem>
              <MenuItem value={5}>5 hours (Good sunlight)</MenuItem>
              <MenuItem value={6}>6+ hours (Excellent sunlight)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Typography variant="subtitle2" color="text.secondary">
        * This is an estimate based on your building's annual energy consumption of {totalEnergy.toFixed(2)} kWh. 
        For an accurate assessment, please consult with a solar energy professional.
      </Typography>
    </Box>
  );
};

export default SolarPanelCalculator; 