const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Export data in different formats
router.post('/results', async (req, res) => {
  try {
    const { data, format } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    if (!format || !['csv', 'json', 'excel'].includes(format)) {
      return res.status(400).json({ error: 'Invalid export format. Supported: csv, json, excel' });
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `query_results_${timestamp}`;

    if (format === 'csv') {
      if (data.length === 0) {
        return res.status(400).json({ error: 'No data to export' });
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (value && (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n'))) {
              return `"${value.toString().replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);

    } else if (format === 'json') {
      const jsonContent = JSON.stringify(data, null, 2);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.send(jsonContent);

    } else if (format === 'excel') {
      // For Excel, we'll return CSV for now since implementing Excel requires additional dependencies
      // In a production environment, you might want to use libraries like 'xlsx' or 'exceljs'
      if (data.length === 0) {
        return res.status(400).json({ error: 'No data to export' });
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value && (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n'))) {
              return `"${value.toString().replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export query history
router.post('/history', async (req, res) => {
  try {
    const { history, format } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'Invalid history format' });
    }

    if (!format || !['csv', 'json'].includes(format)) {
      return res.status(400).json({ error: 'Invalid export format. Supported: csv, json' });
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `query_history_${timestamp}`;

    if (format === 'csv') {
      const headers = ['timestamp', 'query', 'sql_query', 'results_count'];
      const csvContent = [
        headers.join(','),
        ...history.map(item => [
          item.timestamp || '',
          `"${(item.query || '').replace(/"/g, '""')}"`,
          `"${(item.sqlQuery || '').replace(/"/g, '""')}"`,
          item.results || 0
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);

    } else if (format === 'json') {
      const jsonContent = JSON.stringify(history, null, 2);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.send(jsonContent);
    }

  } catch (error) {
    console.error('History export error:', error);
    res.status(500).json({ error: 'Failed to export history' });
  }
});

module.exports = router;
