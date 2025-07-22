import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              mr: 2,
              width: 40,
              height: 40,
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            }}
          >
            <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              QueryGenie
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              AI-Powered SQL Generation
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            icon={<LightbulbIcon />}
            label="Smart Query" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              color: 'white',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }} 
          />
          <Chip 
            icon={<AutoAwesomeIcon />}
            label="AI Powered" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              color: 'white',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
