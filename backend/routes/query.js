const express = require('express');
const Joi = require('joi');
const LLMService = require('../services/llmService');

const router = express.Router();
const llmService = new LLMService();

// Validation schema
const generateQuerySchema = Joi.object({
  query: Joi.string().required().min(3).max(1000),
  schemas: Joi.object().required(),
  provider: Joi.string().valid('GEMINI', 'OPENAI').optional(),
  apiKey: Joi.string().optional()
});

// Generate SQL query from natural language
router.post('/generate-query', async (req, res) => {
  try {
    const { error, value } = generateQuerySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { query, schemas, provider, apiKey } = value;

    // Check if schemas are provided
    if (!schemas || Object.keys(schemas).length === 0) {
      return res.status(400).json({ error: 'Database schemas are required' });
    }

    // Generate SQL query using LLM service with user-provided API key if available
    const response = await llmService.generateSQLQuery(query, schemas, provider, apiKey);

    res.json(response);

  } catch (error) {
    console.error('Query generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate SQL query',
      details: error.message 
    });
  }
});

// Validate SQL query
router.post('/validate-query', async (req, res) => {
  try {
    const { sql_query } = req.body;

    if (!sql_query) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    const isValid = llmService.validateSQLQuery(sql_query);
    
    res.json({
      valid: isValid,
      message: isValid ? 'Query is valid' : 'Query is invalid or unsafe'
    });

  } catch (error) {
    console.error('Query validation error:', error);
    res.status(500).json({ error: 'Failed to validate query' });
  }
});

// Get query suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const { schemas } = req.body;

    if (!schemas || Object.keys(schemas).length === 0) {
      return res.status(400).json({ error: 'Database schemas are required' });
    }

    const suggestions = llmService.generateQuerySuggestions(schemas);
    
    res.json({ suggestions });

  } catch (error) {
    console.error('Suggestions generation error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
