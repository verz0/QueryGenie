import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QueryInterface from './components/QueryInterface';
import ResultsDisplay from './components/ResultsDisplay';
import DecisionLogDisplay from './components/DecisionLogDisplay';
import QueryHistory from './components/QueryHistory';
import { queryService } from './services/queryService';

const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // Cyan
      light: '#67e8f9',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Gradient background
      paper: 'rgba(30, 41, 59, 0.8)', // Semi-transparent cards
    },
    surface: {
      main: '#1e293b',
      light: '#334155',
      dark: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    accent: {
      main: '#8b5cf6', // Purple accent
      light: '#a78bfa',
      dark: '#7c3aed',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 500,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(71, 85, 105, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: 'rgba(51, 65, 85, 0.5)',
          backdropFilter: 'blur(10px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(71, 85, 105, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          minHeight: '48px',
          '&.Mui-selected': {
            color: '#6366f1',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#6366f1',
          height: '3px',
          borderRadius: '3px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fontWeight: 600,
            color: '#f8fafc',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(51, 65, 85, 0.2)',
          },
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [dbConfig, setDbConfig] = useState({
    type: 'SQLite',
    file: null,
    host: '',
    dbName: '',
    user: '',
    password: '',
  });
  const [schemas, setSchemas] = useState({});
  const [selectedTables, setSelectedTables] = useState([]);
  const [queryResults, setQueryResults] = useState(null);
  const [decisionLog, setDecisionLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);

  useEffect(() => {
    // Load query history from localStorage
    const savedHistory = localStorage.getItem('querygenie-query-history');
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleDatabaseConnect = async (config) => {
    try {
      setLoading(true);
      setError('');
      setDbConfig(config);
      
      let schemasData;
      if (config.type === 'SQLite' && config.file) {
        schemasData = await queryService.getSchemas(config);
      } else if (config.type === 'PostgreSQL' && config.host && config.dbName && config.user && config.password) {
        schemasData = await queryService.getSchemas(config);
      } else {
        setSchemas({});
        return;
      }
      
      setSchemas(schemasData);
      setSelectedTables(Object.keys(schemasData));
    } catch (err) {
      setError('Failed to connect to database: ' + err.message);
      setSchemas({});
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelection = (tables) => {
    setSelectedTables(tables);
  };

  const handleQuerySubmit = async (query) => {
    try {
      setLoading(true);
      setError('');
      
      const selectedSchemas = {};
      selectedTables.forEach(table => {
        if (schemas[table]) {
          selectedSchemas[table] = schemas[table];
        }
      });

      const response = await queryService.generateSQLQuery(query, selectedSchemas);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      setDecisionLog(response.decision_log);
      
      if (response.query) {
        const results = await queryService.executeQuery(response.query, dbConfig);
        setQueryResults(results);
        
        // Add to query history
        const historyItem = {
          id: Date.now(),
          query: query,
          sqlQuery: response.query,
          timestamp: new Date().toISOString(),
          results: results?.data?.length || 0,
        };
        
        const newHistory = [historyItem, ...queryHistory.slice(0, 49)]; // Keep last 50 queries
        setQueryHistory(newHistory);
        localStorage.setItem('querygenie-query-history', JSON.stringify(newHistory));
      }
    } catch (err) {
      setError('Failed to process query: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryFromHistory = async (historyItem) => {
    await handleQuerySubmit(historyItem.query);
  };

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
            <Sidebar
              dbConfig={dbConfig}
              schemas={schemas}
              selectedTables={selectedTables}
              onDatabaseConnect={handleDatabaseConnect}
              onTableSelection={handleTableSelection}
              loading={loading}
            />
            <QueryHistory
              history={queryHistory}
              onQuerySelect={handleQueryFromHistory}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth={false} sx={{ flex: 1, py: 2 }}>
              {error && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.dark' }}>
                  <Typography color="error.contrastText">{error}</Typography>
                </Paper>
              )}
              
              <QueryInterface
                onQuerySubmit={handleQuerySubmit}
                loading={loading}
                disabled={selectedTables.length === 0}
              />

              {decisionLog && (
                <DecisionLogDisplay
                  decisionLog={decisionLog}
                  sx={{ mt: 2 }}
                />
              )}

              {queryResults && (
                <ResultsDisplay
                  results={queryResults}
                  sx={{ mt: 2 }}
                />
              )}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
