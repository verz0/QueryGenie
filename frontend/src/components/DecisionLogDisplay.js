import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DecisionLogDisplay = ({ decisionLog, ...props }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!decisionLog) {
    return (
      <Paper 
        sx={{ 
          p: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        {...props}
      >
        <TimelineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.6 }} />
        <Typography variant="body2" color="text.secondary">
          No decision log available
        </Typography>
      </Paper>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    {
      label: 'Input Analysis',
      content: (
        <Box>
          {decisionLog.query_input_details && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Query Input Details
              </Typography>
              {decisionLog.query_input_details.map((detail, index) => (
                <Alert 
                  key={index} 
                  severity="info" 
                  sx={{ 
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    '& .MuiAlert-icon': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  {detail}
                </Alert>
              ))}
            </Box>
          )}
          
          {decisionLog.preprocessing_steps && (
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Preprocessing Steps
              </Typography>
              {decisionLog.preprocessing_steps.map((step, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    mb: 1,
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Monaco, Consolas, monospace',
                        color: 'text.primary',
                      }}
                    >
                      {step}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )
    },
    {
      label: 'Paths',
      content: (
        <Box>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb: 2,
            }}
          >
            Path Identification
          </Typography>
          {decisionLog.path_identification?.map((path, index) => (
            <Accordion 
              key={index} 
              defaultExpanded={index === 0}
              sx={{
                mb: 2,
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{
                  borderRadius: '8px 8px 0 0',
                  background: 'rgba(139, 92, 246, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                    }}
                  >
                    Path {index + 1}
                  </Typography>
                  <Chip 
                    label={`Score: ${path.score}`} 
                    color={index === 0 ? 'primary' : 'default'}
                    size="small"
                    sx={{
                      background: index === 0 
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(99, 102, 241, 0.1)',
                      color: index === 0 ? 'white' : 'primary.main',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ 
                background: 'rgba(139, 92, 246, 0.02)',
                borderRadius: '0 0 8px 8px',
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontStyle: 'italic' }}
                >
                  {path.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      Tables:
                    </Typography>
                    {path.tables?.map((table, i) => (
                      <Chip 
                        key={i} 
                        label={table} 
                        size="small" 
                        sx={{ 
                          mr: 0.5, 
                          mb: 0.5,
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: 'secondary.main',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                        }} 
                      />
                    ))}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Columns:</Typography>
                    {path.columns?.map((cols, i) => (
                      <Box key={i} sx={{ mb: 0.5 }}>
                        {cols.map((col, j) => (
                          <Chip key={j} label={col} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                        ))}
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )
    },
    {
      label: 'SQL Query',
      content: (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Generated SQL Query</Typography>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(decisionLog.generated_sql_query)}
            >
              Copy Query
            </Button>
          </Box>
          {decisionLog.generated_sql_query && (
            <SyntaxHighlighter
              language="sql"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {decisionLog.generated_sql_query}
            </SyntaxHighlighter>
          )}
        </Box>
      )
    },
    {
      label: 'Summary',
      content: (
        <Box>
          {decisionLog.final_summary && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Analysis Summary</Typography>
              <Alert severity="success">
                {decisionLog.final_summary}
              </Alert>
            </Box>
          )}
          
          {decisionLog.visualization_suggestion && (
            <Box>
              <Typography variant="h6" gutterBottom>Visualization Recommendation</Typography>
              <Alert severity="info" icon={<TimelineIcon />}>
                <Typography variant="body2">
                  <strong>Suggested visualization:</strong> {decisionLog.visualization_suggestion}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  This chart type was selected based on the data structure and analysis goals.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>
      )
    }
  ];

  // Filter tabs that have content
  const availableTabs = tabs.filter(tab => {
    if (tab.label === 'Input Analysis') {
      return decisionLog.query_input_details || decisionLog.preprocessing_steps;
    }
    if (tab.label === 'Paths') {
      return decisionLog.path_identification;
    }
    if (tab.label === 'SQL Query') {
      return decisionLog.generated_sql_query;
    }
    if (tab.label === 'Summary') {
      return decisionLog.final_summary || decisionLog.visualization_suggestion;
    }
    return false;
  });

  if (availableTabs.length === 0) {
    return null;
  }

  return (
    <Paper 
      {...props} 
      sx={{ 
        ...props.sx,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
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
          <TimelineIcon sx={{ color: 'primary.main' }} />
          Decision Log
        </Typography>
        
        <Tabs 
          value={Math.min(activeTab, availableTabs.length - 1)} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              height: 3,
            },
            '& .MuiTab-root': {
              color: 'text.secondary',
              fontWeight: 500,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              },
            },
          }}
        >
          {availableTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        
        <Box sx={{ mt: 3 }}>
          {availableTabs[Math.min(activeTab, availableTabs.length - 1)]?.content}
        </Box>
      </Box>
    </Paper>
  );
};

export default DecisionLogDisplay;
