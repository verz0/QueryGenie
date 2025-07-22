import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon />
        Natural Language Query
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your query in natural language here... (e.g., 'Show me all customers from New York')"
          disabled={disabled || loading}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Voice input (coming soon)">
              <IconButton disabled>
                <MicIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!query.trim() || loading || disabled}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Processing...' : 'Generate SQL'}
          </Button>
        </Box>
      </Box>

      {disabled && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
          Please select at least one table to enable querying.
        </Typography>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Example Queries:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {exampleQueries.map((example, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            onClick={() => handleExampleClick(example)}
            disabled={disabled || loading}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.75rem',
              borderRadius: 3,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }
            }}
          >
            {example}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default QueryInterface;
