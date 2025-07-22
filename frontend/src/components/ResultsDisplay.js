import React, { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple  
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#84cc16', // Lime
  '#f97316', // Orange
  '#3b82f6', // Blue
];

const ResultsDisplay = ({ results, ...props }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [chartType, setChartType] = useState('Bar Chart');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);

  // Always call hooks before any early returns
  const data = results?.data || [];
  const columns = results?.columns || (data.length > 0 ? Object.keys(data[0]) : []);

  const summaryStats = useMemo(() => {
    if (data.length === 0) return {};

    const stats = {};
    const numericColumns = columns.filter(col => {
      const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined);
      return values.length > 0 && values.every(val => !isNaN(parseFloat(val)));
    });

    numericColumns.forEach(col => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
      if (values.length > 0) {
        const sorted = values.sort((a, b) => a - b);
        stats[col] = {
          count: values.length,
          mean: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          median: sorted.length % 2 === 0 
            ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(2)
            : sorted[Math.floor(sorted.length / 2)].toFixed(2),
          min: Math.min(...values).toFixed(2),
          max: Math.max(...values).toFixed(2),
          std: Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length).toFixed(2)
        };
      }
    });

    return stats;
  }, [data, columns]);

  if (!results || !results.data) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportData = (format) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `query_results_${timestamp}`;

    if (format === 'csv') {
      const csv = [
        columns.join(','),
        ...data.map(row => columns.map(col => `"${row[col] || ''}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderChart = () => {
    if (!xColumn || (!yColumn && chartType !== 'Pie Chart')) return null;

    const chartData = data.slice(0, 50); // Limit for performance

    const commonProps = {
      width: '100%',
      height: 400,
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (chartType) {
      case 'Bar Chart':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Legend />
              <Bar dataKey={yColumn} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Line Chart':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey={yColumn} stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'Area Chart':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey={yColumn} stroke="#6366f1" fill="url(#colorGradient)" fillOpacity={0.8} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'Scatter Plot':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
              <XAxis dataKey={xColumn} name={xColumn} stroke="#cbd5e1" />
              <YAxis dataKey={yColumn} name={yColumn} stroke="#cbd5e1" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Scatter dataKey={yColumn} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'Pie Chart':
        const pieData = chartData.reduce((acc, item) => {
          const key = item[xColumn];
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const pieChartData = Object.entries(pieData).map(([name, value]) => ({ name, value }));

        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Paper {...props} sx={{ ...props.sx }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <BarChartIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Query Results
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {data.length} rows retrieved
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setChartDialogOpen(true)}
              disabled={data.length === 0}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Visualize
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportData('csv')}
              disabled={data.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                },
              }}
            >
              Export CSV
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportData('json')}
              disabled={data.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669, #047857)',
                },
              }}
            >
              Export JSON
            </Button>
          </Box>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
          }}
        >
          <Tab 
            label="Data Table" 
            sx={{
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
            }} 
          />
          <Tab 
            label="Summary Statistics" 
            sx={{
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
            }} 
          />
          <Tab 
            label="Visualization" 
            sx={{
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
            }} 
          />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {row[column]?.toString() || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {Object.entries(summaryStats).map(([column, stats]) => (
                <Grid item xs={12} md={6} lg={4} key={column}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)',
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            mr: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                            {column.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {column}
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {Object.entries(stats).map(([stat, value]) => (
                          <Grid item xs={6} key={stat}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                                border: '1px solid rgba(71, 85, 105, 0.2)',
                              }}
                            >
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
                                {stat.charAt(0).toUpperCase() + stat.slice(1)}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
                                {value}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {Object.keys(summaryStats).length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No numeric columns found for statistical analysis.
              </Typography>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    label="Chart Type"
                  >
                    <MenuItem value="Bar Chart">Bar Chart</MenuItem>
                    <MenuItem value="Line Chart">Line Chart</MenuItem>
                    <MenuItem value="Area Chart">Area Chart</MenuItem>
                    <MenuItem value="Scatter Plot">Scatter Plot</MenuItem>
                    <MenuItem value="Pie Chart">Pie Chart</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>X-Axis</InputLabel>
                  <Select
                    value={xColumn}
                    onChange={(e) => setXColumn(e.target.value)}
                    label="X-Axis"
                  >
                    {columns.map((col) => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {chartType !== 'Pie Chart' && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Y-Axis</InputLabel>
                    <Select
                      value={yColumn}
                      onChange={(e) => setYColumn(e.target.value)}
                      label="Y-Axis"
                    >
                      {columns.map((col) => (
                        <MenuItem key={col} value={col}>{col}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Box 
              sx={{ 
                height: 400, 
                border: '2px solid',
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderRadius: 3,
                p: 3,
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(51, 65, 85, 0.2))',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                  pointerEvents: 'none',
                },
              }}
            >
              {renderChart() || (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="textSecondary">
                    Select columns to generate visualization
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog 
        open={chartDialogOpen} 
        onClose={() => setChartDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Data Visualization</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  label="Chart Type"
                >
                  <MenuItem value="Bar Chart">Bar Chart</MenuItem>
                  <MenuItem value="Line Chart">Line Chart</MenuItem>
                  <MenuItem value="Area Chart">Area Chart</MenuItem>
                  <MenuItem value="Scatter Plot">Scatter Plot</MenuItem>
                  <MenuItem value="Pie Chart">Pie Chart</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>X-Axis</InputLabel>
                <Select
                  value={xColumn}
                  onChange={(e) => setXColumn(e.target.value)}
                  label="X-Axis"
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {chartType !== 'Pie Chart' && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Y-Axis</InputLabel>
                  <Select
                    value={yColumn}
                    onChange={(e) => setYColumn(e.target.value)}
                    label="Y-Axis"
                  >
                    {columns.map((col) => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Box sx={{ height: 500 }}>
            {renderChart()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChartDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ResultsDisplay;
