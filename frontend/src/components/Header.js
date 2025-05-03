import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(90deg, #1a73e8, #66bb6a)',
        padding: '30px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '20px',
        borderRadius: { xs: 0, md: '0 0 12px 12px' }
      }}
    >
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        🏡 DEMO Đồ án nhóm 2
      </Typography>
      <Typography variant="h6">
        Enter architectural parameters to predict energy performance
      </Typography>
    </Box>
  );
};

export default Header; 