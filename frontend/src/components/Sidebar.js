import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HomeIcon from '@mui/icons-material/Home';
import { useLanguage } from '../services/LanguageContext';

const Sidebar = ({ currentModule, onModuleChange }) => {
  const { translations } = useLanguage();

  const modules = [
    { id: 'hvac', name: translations.sidebar.hvac, icon: <BuildIcon /> },
    { id: 'cost', name: translations.sidebar.cost, icon: <AttachMoneyIcon /> },
    { id: 'co2', name: translations.sidebar.co2, icon: <Co2Icon /> },
    { id: 'solar', name: translations.sidebar.solar, icon: <WbSunnyIcon /> },
    { id: 'efficiency', name: translations.sidebar.efficiency, icon: <HomeIcon /> }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          p: 2,
          fontWeight: 'bold',
          backgroundColor: 'primary.main',
          color: 'white'
        }}
      >
        🔧 Select Function
      </Typography>

      <List>
        {modules.map((module) => (
          <ListItem key={module.id} disablePadding>
            <ListItemButton
              selected={currentModule === module.id}
              onClick={() => onModuleChange(module.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(26, 115, 232, 0.1)',
                  borderLeft: '4px solid #1a73e8',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 115, 232, 0.2)'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon>
                {module.icon}
              </ListItemIcon>
              <ListItemText primary={module.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar; 