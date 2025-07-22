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

const COLORS = ['#00ADB5', '#64ffda', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yColumn} fill="#00ADB5" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Line Chart':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yColumn} stroke="#00ADB5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'Area Chart':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xColumn} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={yColumn} stroke="#00ADB5" fill="#00ADB5" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'Scatter Plot':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xColumn} name={xColumn} />
              <YAxis dataKey={yColumn} name={yColumn} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey={yColumn} fill="#00ADB5" />
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
              <Tooltip />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon />
            Query Results ({data.length} rows)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => setChartDialogOpen(true)}
              disabled={data.length === 0}
            >
              Visualize
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => exportData('csv')}
              disabled={data.length === 0}
            >
              Export CSV
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => exportData('json')}
              disabled={data.length === 0}
            >
              Export JSON
            </Button>
          </Box>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Data Table" />
          <Tab label="Summary Statistics" />
          <Tab label="Visualization" />
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
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {column}
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(stats).map(([stat, value]) => (
                          <Grid item xs={6} key={stat}>
                            <Typography variant="body2" color="textSecondary">
                              {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {value}
                            </Typography>
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

            <Box sx={{ height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
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
