const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const DatabaseService = require('../services/databaseService');

const router = express.Router();
const dbService = new DatabaseService();

// Validation schemas
const schemaRequestSchema = Joi.object({
  db_type: Joi.string().valid('sqlite', 'postgresql').required(),
  db_name: Joi.string().required(),
  host: Joi.string().when('db_type', { is: 'postgresql', then: Joi.required() }),
  user: Joi.string().when('db_type', { is: 'postgresql', then: Joi.required() }),
  password: Joi.string().when('db_type', { is: 'postgresql', then: Joi.required() })
});

const connectionTestSchema = Joi.object({
  db_type: Joi.string().valid('postgresql').required(),
  db_name: Joi.string().required(),
  host: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required()
});

// Upload database file
router.post('/upload-database', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No database file uploaded' });
    }

    const { filename, originalname, path: filePath, size } = req.file;

    // Validate file size and type
    if (size > 100 * 1024 * 1024) { // 100MB
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'File size exceeds 100MB limit' });
    }

    const allowedTypes = ['.db', '.sqlite', '.sql'];
    const fileExt = path.extname(originalname).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'Invalid file type. Only .db, .sqlite, and .sql files are allowed.' });
    }

    // Copy to a standardized temp location for processing
    const tempPath = path.join(__dirname, '../uploads/temp_database.db');
    fs.copyFileSync(filePath, tempPath);

    res.json({
      success: true,
      filename: 'temp_database.db',
      originalName: originalname,
      size: size,
      uploadId: uuidv4()
    });

  } catch (error) {
    console.error('Database upload error:', error);
    res.status(500).json({ error: 'Failed to upload database file' });
  }
});

// Get database schemas
router.post('/schemas', async (req, res) => {
  try {
    const { error, value } = schemaRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { db_type, db_name, host, user, password } = value;

    let schemas;
    if (db_type === 'sqlite') {
      const dbPath = path.join(__dirname, '../uploads', db_name);
      if (!fs.existsSync(dbPath)) {
        return res.status(404).json({ error: 'Database file not found' });
      }
      schemas = await dbService.getSQLiteSchemas(dbPath);
    } else if (db_type === 'postgresql') {
      schemas = await dbService.getPostgreSQLSchemas(host, db_name, user, password);
    }

    res.json(schemas);

  } catch (error) {
    console.error('Schema retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve database schemas: ' + error.message });
  }
});

// Test database connection
router.post('/test-connection', async (req, res) => {
  try {
    const { error, value } = connectionTestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { db_name, host, user, password } = value;

    const isConnected = await dbService.testPostgreSQLConnection(host, db_name, user, password);
    
    if (isConnected) {
      res.json({ success: true, message: 'Connection successful' });
    } else {
      res.status(400).json({ error: 'Connection failed' });
    }

  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({ error: 'Connection test failed: ' + error.message });
  }
});

// Execute SQL query
router.post('/execute-query', async (req, res) => {
  try {
    const { sql_query, db_type, db_name, host, user, password } = req.body;

    if (!sql_query) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // Validate SQL query for security
    if (!dbService.validateSQLQuery(sql_query)) {
      return res.status(400).json({ error: 'Invalid or unsafe SQL query. Only SELECT queries are allowed.' });
    }

    let results;
    if (db_type === 'sqlite') {
      const dbPath = path.join(__dirname, '../uploads', db_name || 'temp_database.db');
      if (!fs.existsSync(dbPath)) {
        return res.status(404).json({ error: 'Database file not found' });
      }
      results = await dbService.executeSQLiteQuery(dbPath, sql_query);
    } else if (db_type === 'postgresql') {
      if (!host || !db_name || !user || !password) {
        return res.status(400).json({ error: 'PostgreSQL connection details required' });
      }
      results = await dbService.executePostgreSQLQuery(host, db_name, user, password, sql_query);
    } else {
      return res.status(400).json({ error: 'Invalid database type' });
    }

    res.json(results);

  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ error: 'Failed to execute query: ' + error.message });
  }
});

module.exports = router;
