import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  InputAdornment,
  Fade,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const QueryInterface = ({ onQuerySubmit, loading, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading && !disabled) {
      onQuerySubmit(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const exampleQueries = [
    "Show me all customers from New York",
    "What are the top 5 products by sales?",
    "Find orders placed in the last 30 days",
    "Show average order value by customer",
    "List employees with their department names"
  ];

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  return (
    <Paper 
      sx={{ 
        p: 4,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            mr: 2,
            width: 48,
            height: 48,
          }}
        >
          <PsychologyIcon sx={{ fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Ask QueryGenie
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Describe what you want to find in plain English
          </Typography>
        </Box>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your data... (e.g., 'Show me the top 10 customers by revenue this year')"
          disabled={disabled || loading}
          sx={{ 
            mb: 3,
            '& .MuiInputBase-root': {
              fontSize: '1.1rem',
              lineHeight: 1.6,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Voice input (coming soon)">
              <IconButton 
                disabled
                sx={{
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Press Enter to send
            </Typography>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={loading ? <AutoAwesomeIcon className="animate-spin" /> : <SendIcon />}
            disabled={!query.trim() || loading || disabled}
            sx={{ 
              minWidth: 140,
              py: 1.5,
              px: 3,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              },
              '&:disabled': {
                background: 'rgba(99, 102, 241, 0.3)',
              },
            }}
          >
            {loading ? 'Thinking...' : 'Generate SQL'}
          </Button>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TipsAndUpdatesIcon sx={{ color: 'warning.main', mr: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Try these examples:
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {exampleQueries.map((example, index) => (
            <Chip
              key={index}
              label={example}
              variant="outlined"
              onClick={() => handleExampleClick(example)}
              sx={{
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: 'text.secondary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: 'primary.main',
                  transform: 'translateY(-1px)',
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {disabled && (
        <Fade in={disabled}>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'warning.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TipsAndUpdatesIcon />
            Please select at least one table to enable querying.
          </Typography>
        </Fade>
      )}
    </Paper>
  );
};

export default QueryInterface;
