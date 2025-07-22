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
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DatabaseIcon />
        Database Configuration
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl fullWidth margin="normal">
          <Typography variant="subtitle2" gutterBottom>Database Type</Typography>
          <Select
            value={config.type}
            onChange={handleDbTypeChange}
            size="small"
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
              borderColor: isDragActive ? 'primary.main' : 'grey.500',
              borderRadius: 2,
              p: 3,
              mt: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main'
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              {isDragActive ? 'Drop the SQLite file here' : 'Drag & drop SQLite file or click to select'}
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
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
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
            />
            <TextField
              fullWidth
              size="small"
              label="Database Name"
              value={config.dbName}
              onChange={(e) => setConfig(prev => ({ ...prev, dbName: e.target.value }))}
              margin="dense"
            />
            <TextField
              fullWidth
              size="small"
              label="Username"
              value={config.user}
              onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
              margin="dense"
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
              margin="dense"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handlePostgresConnect}
              disabled={!config.host || !config.dbName || !config.user || !config.password || loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Connect'}
            </Button>
          </Box>
        )}
      </Paper>

      {tableNames.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Table Selection
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Button
              size="small"
              onClick={handleSelectAll}
              variant="outlined"
            >
              {selectedTables.length === tableNames.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Typography variant="caption" sx={{ ml: 2 }}>
              {selectedTables.length} of {tableNames.length} selected
            </Typography>
          </Box>

          <FormGroup>
            {tableNames.map((tableName) => (
              <Box key={tableName} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTables.includes(tableName)}
                      onChange={() => handleTableToggle(tableName)}
                      size="small"
                    />
                  }
                  label={tableName}
                />
                <Accordion
                  expanded={expandedSchema === tableName}
                  onChange={() => setExpandedSchema(expandedSchema === tableName ? null : tableName)}
                  sx={{ mt: 0.5 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ minHeight: 32, '& .MuiAccordionSummary-content': { margin: '8px 0' } }}
                  >
                    <Typography variant="caption">View Schema</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box>
                      {schemas[tableName] && Object.entries(schemas[tableName]).map(([column, type]) => (
                        <Typography key={column} variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                          {column}: {type}
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
