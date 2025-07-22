import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Chip,
  Pagination,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { formatDistanceToNow } from 'date-fns';

const QueryHistory = ({ history, onQuerySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sqlQuery.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (history.length === 0) {
    return (
      <Paper sx={{ 
        p: 4, 
        m: 2,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <HistoryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.6 }} />
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1,
          }}
        >
          Query History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No query history available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      m: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 3,
        }}
      >
        <HistoryIcon sx={{ color: 'primary.main' }} />
        Query History
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search queries..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
        }}
        sx={{ 
          mb: 3,
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

      <List>
        {paginatedHistory.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              flexDirection: 'column',
              alignItems: 'stretch',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 2,
              mb: 2,
              p: 2,
              background: 'rgba(99, 102, 241, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    color: 'text.primary',
                  }}
                >
                  {item.query.length > 60 ? `${item.query.substring(0, 60)}...` : item.query}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </Typography>
                  <Chip
                    label={`${item.results} rows`}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 20,
                      background: 'rgba(6, 182, 212, 0.1)',
                      color: 'secondary.main',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                    }}
                  />
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => onQuerySelect(item)}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            </Box>
            
            <Accordion sx={{ 
              mt: 1, 
              boxShadow: 'none', 
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: 1,
              '&:before': { display: 'none' } 
            }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  minHeight: 32, 
                  '& .MuiAccordionSummary-content': { margin: '8px 0' },
                  py: 0,
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '4px 4px 0 0',
                }}
              >
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                >
                  View SQL Query
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ 
                pt: 0, 
                pb: 1,
                background: 'rgba(139, 92, 246, 0.02)',
                borderRadius: '0 0 4px 4px',
              }}>
                <Typography 
                  variant="caption" 
                  component="pre" 
                  sx={{ 
                    fontFamily: 'Monaco, Consolas, monospace', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    p: 1.5, 
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'text.primary',
                  }}
                >
                  {item.sqlQuery}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </ListItem>
        ))}
      </List>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'primary.main',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                  },
                },
              },
            }}
            size="small"
            color="primary"
          />
        </Box>
      )}

      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
        Showing {paginatedHistory.length} of {filteredHistory.length} queries
      </Typography>
    </Paper>
  );
};

export default QueryHistory;
