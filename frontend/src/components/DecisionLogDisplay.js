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
    return null;
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
              <Typography variant="h6" gutterBottom>Query Input Details</Typography>
              {decisionLog.query_input_details.map((detail, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {detail}
                </Alert>
              ))}
            </Box>
          )}
          
          {decisionLog.preprocessing_steps && (
            <Box>
              <Typography variant="h6" gutterBottom>Preprocessing Steps</Typography>
              {decisionLog.preprocessing_steps.map((step, index) => (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
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
          <Typography variant="h6" gutterBottom>Path Identification</Typography>
          {decisionLog.path_identification?.map((path, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="subtitle1">Path {index + 1}</Typography>
                  <Chip 
                    label={`Score: ${path.score}`} 
                    color={index === 0 ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {path.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Tables:</Typography>
                    {path.tables?.map((table, i) => (
                      <Chip key={i} label={table} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
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
    <Paper {...props} sx={{ ...props.sx }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon />
          Decision Log
        </Typography>
        
        <Tabs 
          value={Math.min(activeTab, availableTabs.length - 1)} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {availableTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        
        <Box sx={{ mt: 2 }}>
          {availableTabs[Math.min(activeTab, availableTabs.length - 1)]?.content}
        </Box>
      </Box>
    </Paper>
  );
};

export default DecisionLogDisplay;
