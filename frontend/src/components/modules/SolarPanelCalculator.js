import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

const panelOptions = [
  { type: 'Pin Mặt Trời JinKo Tiger Pro 550W', wattage: 550, area: 2.578716, price: 2250000, efficiency: 0.2133},
  { type: 'Tấm Pin Năng Lượng Mặt Trời 150W Mono', wattage: 150, area: 0.85598, price: 1450000, efficiency: 0.188},
  { type: 'Pin mặt trời Canadian 450 Wp', wattage: 450, area: 2.209184, price: 2250000, efficiency: 0.2037},
  { type: 'Pin mặt trời LONGi Solar 450W', wattage: 450, area: 2.173572, price: 3250000, efficiency: 0.207},
  { type: 'Pin Mặt Trời JinKo Tiger Pro 535W', wattage: 535, area: 2.578716, price: 2200000, efficiency: 0.2075},
  { type: 'Pin Mặt Trời Qcell 420 Wp Korea', wattage: 420, area: 2.1424, price: 3685000, efficiency: 0.196},
  { type: 'Tấm pin mặt trời AE solar', wattage: 370, area: 1.940352, price: 1965000, efficiency: 0.1907},
  { type: 'Tấm Pin Năng Lượng Mặt Trời 200W Mono', wattage: 200, area: 1.0064, price: 1650000, efficiency: 0.1915}
];


const SolarPanelCalculator = ({ heatingLoad, coolingLoad, roofArea }) => {
  const [selectedPanelType, setSelectedPanelType] = useState(panelOptions[0].type);
  const [sunshineHours, setSunshineHours] = useState(4); // Peak Sun Hours

  const panel = panelOptions.find(p => p.type === selectedPanelType);
  const { wattage: panelWattage, area: panelArea, price: panelPrice, efficiency: panelEfficiency } = panel;

  const hoursPerDay = 12;

  const chartData = panelOptions.map((panel) => {
    const dailyOutputPerPanel = (panel.wattage * sunshineHours * panel.efficiency) / 1000;
    const requiredDaily = (heatingLoad + coolingLoad) * hoursPerDay;
  
    const actualPanels = Math.floor(roofArea / panelArea);
    const actualDailyOutput = actualPanels * dailyOutputPerPanel;
    const percentMet = (actualDailyOutput / requiredDaily) * 100;
    const totalCost = actualPanels * panel.price;
  
    return {
      name: panel.type,
      percentMet: +percentMet.toFixed(1),
      totalCost: totalCost, // triệu VND
    };
  });
  
  // Daily energy requirement (kWh)
  const requiredDaily = ((heatingLoad + coolingLoad) * hoursPerDay);

  // Daily output per panel (kWh)
  const dailyPanelOutput = (panelWattage * sunshineHours * panelEfficiency) / 1000;
  
  // Max number of panels that can fit
  const actualPanels = Math.floor(roofArea / panelArea);

  // Total daily output from all panels (kWh)
  const actualDailyOutput = actualPanels * dailyPanelOutput;

  // Percentage of energy demand met
  const percentMet = (actualDailyOutput / requiredDaily) * 100;

  // Total cost (excluding installation)
  const totalCost = actualPanels * panelPrice;

  const recommendation =
    percentMet < 100
      ? `Your solar system reduces approximately ${percentMet.toFixed(1)}% of CO₂ emissions based on your daily energy needs. Consider upgrading to higher-efficiency panels to further minimize your environmental impact.`
      : `Your current solar setup can fully offset your daily CO₂ emissions, making a significant contribution to environmental protection and sustainability.`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WbSunnyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          Solar System Advisor
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" paragraph>
        Based on your building's energy demand and available roof area, this is your recommended solar configuration:
      </Typography>

      <Box sx={{ p: 2, backgroundColor: 'rgba(66, 165, 245, 0.1)', borderRadius: 2, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SolarPowerIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Recommended System
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {actualPanels}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Panels Fit on Roof
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {actualDailyOutput.toFixed(1)} kWh daily output
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
                  <Typography variant="body2"><strong>Roof Area:</strong> {roofArea} m²</Typography>
                  <Typography variant="body2"><strong>Panel Type:</strong> {selectedPanelType}</Typography>
                  <Typography variant="body2"><strong>Wattage:</strong> {panelWattage} Wp</Typography>
                  <Typography variant="body2"><strong>Area per Panel:</strong> {panelArea} m²</Typography>
                  <Typography variant="body2"><strong>Efficiency:</strong> {(panelEfficiency * 100).toFixed(1)}%</Typography>
                  <Typography variant="body2"><strong>Output per Panel/day:</strong> {dailyPanelOutput.toFixed(2)} kWh</Typography>
                  <Typography variant="body2"><strong>Number of Panels:</strong> {actualPanels}</Typography>
                  <Typography variant="body2"><strong>Daily Energy Need:</strong> {requiredDaily.toFixed(1)} kWh</Typography>
                  <Typography variant="body2"><strong>Demand Met:</strong> {percentMet.toFixed(1)}%</Typography>
                  <Typography variant="body2"><strong>Total Cost:</strong> {totalCost.toLocaleString()} VND</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {recommendation}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" gutterBottom>
        Customize Settings:
      </Typography>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="panel-type-label">Panel Type</InputLabel>
            <Select
              labelId="panel-type-label"
              value={selectedPanelType}
              label="Solar Panel Type"
              onChange={(e) => setSelectedPanelType(e.target.value)}
            >
              {panelOptions.map((opt) => (
                <MenuItem key={opt.type} value={opt.type}>
                  {opt.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="sunshine-hours-label">Sunlight Hours (PSH)</InputLabel>
            <Select
              labelId="sunshine-hours-label"
              value={sunshineHours}
              label="Effective Sunshine Hours"
              onChange={(e) => setSunshineHours(e.target.value)}
            >
              <MenuItem value={3}>3 hours (low)</MenuItem>
              <MenuItem value={4}>4 hours (average)</MenuItem>
              <MenuItem value={5}>5 hours (good)</MenuItem>
              <MenuItem value={6}>6 hours (excellent)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary">
        * This is a basic estimation. For detailed planning and installation, please consult with a certified solar energy professional.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Demand Coverage Comparison (%)
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} label={{ value: '% Demand Met', position: 'insideBottomRight', offset: -5 }} />
          <YAxis type="category" dataKey="name" width={200} />
          <Tooltip />
          <Bar dataKey="percentMet" fill="#4caf50" name="% Demand Met" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
        Total Cost Comparison (mil VND)
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'Cost (mil VND)', position: 'insideBottomRight', offset: -5 }} />
          <YAxis type="category" dataKey="name" width={200} />
          <Tooltip />
          <Bar dataKey="totalCost" fill="#f44336" name="Total Cost" />
        </BarChart>
      </ResponsiveContainer>


    </Box>
  );
};


export default SolarPanelCalculator;