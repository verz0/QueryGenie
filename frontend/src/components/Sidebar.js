import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatabaseIcon from '@mui/icons-material/Storage';
import { useDropzone } from 'react-dropzone';
import ApiKeyConfig from './ApiKeyConfig';

const Sidebar = ({ 
  dbConfig, 
  schemas, 
  selectedTables, 
  onDatabaseConnect, 
  onTableSelection, 
  loading 
}) => {
  const [config, setConfig] = useState(dbConfig);
  const [expandedSchema, setExpandedSchema] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setConfig(prev => ({ ...prev, file }));
      onDatabaseConnect({ ...config, file });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-sqlite3': ['.db', '.sqlite', '.sql'],
      'application/octet-stream': ['.db', '.sqlite']
    },
    multiple: false
  });

  const handleDbTypeChange = (event) => {
    const newType = event.target.value;
    setConfig(prev => ({ ...prev, type: newType }));
  };

  const handlePostgresConnect = () => {
    onDatabaseConnect(config);
  };

  const handleTableToggle = (tableName) => {
    const newSelection = selectedTables.includes(tableName)
      ? selectedTables.filter(t => t !== tableName)
      : [...selectedTables, tableName];
    onTableSelection(newSelection);
  };

  const handleSelectAll = () => {
    const allTables = Object.keys(schemas);
    onTableSelection(selectedTables.length === allTables.length ? [] : allTables);
  };

  const tableNames = Object.keys(schemas);

  return (
    <Box sx={{ 
      p: 2, 
      height: '100%', 
      overflow: 'auto',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
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
        <DatabaseIcon sx={{ color: 'primary.main' }} />
        Configuration
      </Typography>

      <ApiKeyConfig />

      <Paper sx={{ 
        p: 3, 
        mb: 3,
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
          <DatabaseIcon sx={{ color: 'primary.main' }} />
          Database Setup
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
            Database Type
          </Typography>
          <Select
            value={config.type}
            onChange={handleDbTypeChange}
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
            <MenuItem value="SQLite">SQLite</MenuItem>
            <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
          </Select>
        </FormControl>

        {config.type === 'SQLite' && (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'rgba(99, 102, 241, 0.3)',
              borderRadius: 3,
              p: 4,
              mt: 2,
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                : 'rgba(99, 102, 241, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ 
              fontSize: 48, 
              color: 'primary.main', 
              mb: 2,
              opacity: 0.8,
            }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                mb: 1,
              }}
            >
              {isDragActive ? 'Drop the SQLite file here' : 'Drag & drop SQLite file or click to select'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: 'block',
              }}
            >
              Supports .db, .sqlite files
            </Typography>
            {config.file && (
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                Selected: {config.file.name}
              </Typography>
            )}
          </Box>
        )}

        {config.type === 'PostgreSQL' && (
          <Box>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                mt: 3,
                fontWeight: 600,
                color: 'primary.main',
                mb: 2,
              }}
            >
              Connection Details
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Host"
              placeholder="localhost"
              value={config.host}
              onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
            <TextField
              fullWidth
              size="small"
              label="Database Name"
              value={config.dbName}
              onChange={(e) => setConfig(prev => ({ ...prev, dbName: e.target.value }))}
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
            <TextField
              fullWidth
              size="small"
              label="Username"
              value={config.user}
              onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
            <Button
              fullWidth
              variant="contained"
              onClick={handlePostgresConnect}
              disabled={!config.host || !config.dbName || !config.user || !config.password || loading}
              sx={{ 
                mt: 3,
                borderRadius: 2,
                py: 1.5,
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
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Connect to Database'}
            </Button>
          </Box>
        )}
      </Paper>

      {tableNames.length > 0 && (
        <Paper sx={{ 
          p: 3,
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
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 3,
            }}
          >
            Table Selection
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Button
              size="small"
              onClick={handleSelectAll}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {selectedTables.length === tableNames.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 2,
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {selectedTables.length} of {tableNames.length} selected
            </Typography>
          </Box>

          <FormGroup>
            {tableNames.map((tableName) => (
              <Box 
                key={tableName} 
                sx={{ 
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTables.includes(tableName)}
                      onChange={() => handleTableToggle(tableName)}
                      size="small"
                      sx={{
                        color: 'rgba(99, 102, 241, 0.5)',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      sx={{ 
                        fontWeight: selectedTables.includes(tableName) ? 600 : 400,
                        color: selectedTables.includes(tableName) ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {tableName}
                    </Typography>
                  }
                />
                <Accordion
                  expanded={expandedSchema === tableName}
                  onChange={() => setExpandedSchema(expandedSchema === tableName ? null : tableName)}
                  sx={{ 
                    mt: 1,
                    background: 'transparent',
                    boxShadow: 'none',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 1,
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ 
                      minHeight: 32, 
                      '& .MuiAccordionSummary-content': { margin: '8px 0' },
                      borderRadius: 1,
                    }}
                  >
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 500,
                      }}
                    >
                      View Schema
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ 
                    pt: 0,
                    background: 'rgba(99, 102, 241, 0.02)',
                    borderRadius: '0 0 4px 4px',
                  }}>
                    <Box>
                      {schemas[tableName] && Object.entries(schemas[tableName]).map(([column, type]) => (
                        <Typography 
                          key={column} 
                          variant="caption" 
                          component="div" 
                          sx={{ 
                            fontFamily: 'Monaco, Consolas, monospace',
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            background: 'rgba(99, 102, 241, 0.05)',
                            mb: 0.5,
                            color: 'text.primary',
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {column}
                          </Box>
                          <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                            : {type}
                          </Box>
                        </Typography>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </FormGroup>
        </Paper>
      )}

      {tableNames.length === 0 && config.type === 'SQLite' && !config.file && (
        <Alert severity="info">
          Please upload a SQLite database file to start.
        </Alert>
      )}

      {tableNames.length === 0 && config.type === 'PostgreSQL' && (
        <Alert severity="info">
          Please fill in all PostgreSQL connection details to start.
        </Alert>
      )}
    </Box>
  );
};

export default Sidebar;
