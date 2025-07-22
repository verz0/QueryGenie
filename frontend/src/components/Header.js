import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const Header = () => {
  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #00ADB5, #64ffda)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Toolbar>
        <StorageIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          NLP2SQL
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="Azure OpenAI" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }} 
          />
          <Chip 
            label="Gemini" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
