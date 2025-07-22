import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Collapse,
  InputAdornment,
  Chip,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const ApiKeyConfig = () => {
  const [expanded, setExpanded] = useState(false);
  const [provider, setProvider] = useState('GEMINI');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [status, setStatus] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedProvider = localStorage.getItem('llm_provider');
    const savedApiKey = localStorage.getItem('api_key');
    
    if (savedProvider) setProvider(savedProvider);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      setStatus({ type: 'error', message: 'Please enter an API key' });
      return;
    }

    // Save to localStorage
    localStorage.setItem('llm_provider', provider);
    localStorage.setItem('api_key', apiKey);
    
    // Send to backend
    fetch('/api/config/api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        apiKey,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setStatus({ type: 'success', message: 'API key configured successfully!' });
        setIsConfigured(true);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to configure API key' });
      }
    })
    .catch(error => {
      setStatus({ type: 'error', message: 'Network error: ' + error.message });
    });
  };

  const handleClearConfig = () => {
    localStorage.removeItem('llm_provider');
    localStorage.removeItem('api_key');
    setApiKey('');
    setIsConfigured(false);
    setStatus({ type: 'info', message: 'Configuration cleared' });
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyIcon sx={{ color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            API Configuration
          </Typography>
          {isConfigured && (
            <Chip 
              icon={<CheckCircleIcon />}
              label="Configured" 
              size="small"
              sx={{
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            />
          )}
        </Box>
        <IconButton size="small" sx={{ color: 'primary.main' }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, fontStyle: 'italic' }}
          >
            Configure your own API key to use QueryGenie without server-side configuration
          </Typography>

          <FormControl fullWidth margin="normal">
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 1,
              }}
            >
              LLM Provider
            </Typography>
            <Select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              size="small"
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
              }}
            >
              <MenuItem value="GEMINI">Google Gemini</MenuItem>
              <MenuItem value="OPENAI">OpenAI</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 1,
              }}
            >
              API Key
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showApiKey ? 'text' : 'password'}
              placeholder={`Enter your ${provider === 'GEMINI' ? 'Google Gemini' : 'OpenAI'} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowApiKey(!showApiKey)}
                      sx={{ color: 'primary.main' }}
                    >
                      {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(99, 102, 241, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>

          {status && (
            <Alert 
              severity={status.type} 
              sx={{ 
                mt: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: status.type === 'success' ? '#22c55e' : 
                         status.type === 'error' ? '#ef4444' : '#f59e0b',
                },
              }}
            >
              {status.message}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSaveConfig}
              disabled={!apiKey.trim()}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(99, 102, 241, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Save Configuration
            </Button>
            {isConfigured && (
              <Button
                variant="outlined"
                onClick={handleClearConfig}
                sx={{
                  borderRadius: 2,
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2, p: 1.5, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Your API key is stored locally in your browser and sent directly to the AI provider. 
              It's never stored on our servers for security.
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ApiKeyConfig;
