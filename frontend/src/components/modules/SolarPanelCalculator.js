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
import { useLanguage } from '../../services/LanguageContext';

const panelOptions = [
  { type: 'Pin Mặt Trời JinKo Tiger Pro 550W', wattage: 550, area: 2.578716, price: 2250000, efficiency: 0.2133},
  { type: 'Tấm Pin Năng Lượng Mặt Trời 150W Mono', wattage: 150, area: 0.85598, price: 1450000, efficiency: 0.188},
  { type: 'Pin mặt trời Canadian 450 Wp', wattage: 450, area: 2.209184, price: 2250000, efficiency: 0.2037},
  { type: 'Pin mặt trời LONGi Solar 450W', wattage: 450, area: 2.173572, price: 3250000, efficiency: 0.207},
  { type: 'Pin Mặt Trời JinKo Tiger Pro 535W', wattage: 535, area: 2.578716, price: 2200000, efficiency: 0.2075},
  { type: 'Pin Mặt Trời Qcell 420 Wp Korea', wattage: 420, area: 2.1424, price: 3685000, efficiency: 0.196},
  { type: 'Tấm pin mặt trời AE solar', wattage: 370, area: 1.940352, price: 1965000, efficiency: 0.1907},
  { type: 'Tấm Pin Năng Lượng Mặt Trời 200W Mono', wattage: 200, area: 1.0064, price: 1650000, efficiency: 0.1915}
];


const SolarPanelCalculator = ({ heatingLoad, coolingLoad, roofArea }) => {
  const { translations } = useLanguage();
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
          {translations.modules.solar.title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" paragraph>
        {translations.modules.solar.description}
      </Typography>

      <Box sx={{ p: 2, backgroundColor: 'rgba(66, 165, 245, 0.1)', borderRadius: 2, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SolarPowerIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {translations.modules.solar.recommendedSystem}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {actualPanels}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {translations.modules.solar.panelsNeeded}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {actualDailyOutput.toFixed(1)} kWh {translations.modules.solar.estimatedProduction}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {translations.modules.solar.systemCapacity}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>{translations.inputLabels.roofArea}:</strong> {roofArea} m²</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.panelsNeeded}:</strong> {selectedPanelType}</Typography>
                  <Typography variant="body2"><strong>Wattage:</strong> {panelWattage} Wp</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.systemCapacity}:</strong> {panelArea} m²</Typography>
                  <Typography variant="body2"><strong>Efficiency:</strong> {(panelEfficiency * 100).toFixed(1)}%</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.estimatedProduction}:</strong> {dailyPanelOutput.toFixed(2)} kWh</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.panelsNeeded}:</strong> {actualPanels}</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.estimatedProduction}:</strong> {requiredDaily.toFixed(1)} kWh</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.costSavings}:</strong> {percentMet.toFixed(1)}%</Typography>
                  <Typography variant="body2"><strong>{translations.modules.solar.breakeven}:</strong> {totalCost.toLocaleString()} VND</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {translations.modules.solar.carbonReduction}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" gutterBottom>
        {translations.modules.solar.systemCapacity}:
      </Typography>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="panel-type-label">{translations.modules.solar.panelsNeeded}</InputLabel>
            <Select
              labelId="panel-type-label"
              value={selectedPanelType}
              label={translations.modules.solar.panelsNeeded}
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
            <InputLabel id="sunshine-hours-label">{translations.modules.solar.estimatedProduction}</InputLabel>
            <Select
              labelId="sunshine-hours-label"
              value={sunshineHours}
              label={translations.modules.solar.estimatedProduction}
              onChange={(e) => setSunshineHours(e.target.value)}
            >
              <MenuItem value={3}>3 hours ({translations.modules.solar.breakeven})</MenuItem>
              <MenuItem value={4}>4 hours ({translations.modules.solar.costSavings})</MenuItem>
              <MenuItem value={5}>5 hours (good)</MenuItem>
              <MenuItem value={6}>6 hours (excellent)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary">
        * {translations.modules.solar.description}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        {translations.modules.solar.systemCapacity} (%)
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={80}
              interval={0} 
            />
            <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" label={{ value: translations.modules.solar.carbonReduction, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => {
              if (name === "percentMet") return [`${value}%`, translations.modules.solar.carbonReduction];
              if (name === "totalCost") return [`${value.toLocaleString()} VND`, translations.modules.solar.costSavings];
              return [value, name];
            }} />
            <Bar yAxisId="left" dataKey="percentMet" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SolarPanelCalculator;