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
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon />
          Query History
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
          No query history available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon />
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
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
        }}
        sx={{ mb: 2 }}
      />

      <List>
        {paginatedHistory.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              flexDirection: 'column',
              alignItems: 'stretch',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              p: 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {item.query.length > 60 ? `${item.query.substring(0, 60)}...` : item.query}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </Typography>
                  <Chip
                    label={`${item.results} rows`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => onQuerySelect(item)}
                sx={{ color: 'primary.main' }}
              >
                <PlayArrowIcon />
              </IconButton>
            </Box>
            
            <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 32, 
                  '& .MuiAccordionSummary-content': { margin: '8px 0' },
                  py: 0
                }}
              >
                <Typography variant="caption">View SQL Query</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                <Typography 
                  variant="caption" 
                  component="pre" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    bgcolor: 'background.default', 
                    p: 1, 
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
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
