import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../services/LanguageContext';

const Header = () => {
  const { translations, toggleLanguage } = useLanguage();

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(90deg, #1a73e8, #66bb6a)',
        padding: '30px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '20px',
        borderRadius: { xs: 0, md: '0 0 12px 12px' },
        position: 'relative'
      }}
    >
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        {translations.appTitle}
      </Typography>
      <Typography variant="h6">
        {translations.appSubtitle}
      </Typography>
      
      {/* Language toggle button */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<LanguageIcon />}
        onClick={toggleLanguage}
        sx={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px',
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {translations.languageToggle}
      </Button>
    </Box>
  );
};

export default Header; 