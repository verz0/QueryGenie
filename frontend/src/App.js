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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ADB5',
    },
    secondary: {
      main: '#64ffda',
    },
    background: {
      default: '#1e1e1e',
      paper: '#333333',
    },
    text: {
      primary: '#64ffda',
      secondary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
    const savedHistory = localStorage.getItem('nlp2sql-query-history');
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
        localStorage.setItem('nlp2sql-query-history', JSON.stringify(newHistory));
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
    <ThemeProvider theme={darkTheme}>
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
