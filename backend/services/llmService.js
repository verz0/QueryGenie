const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'AZURE';
    this.setupProvider();
  }

  setupProvider() {
    if (this.provider === 'AZURE') {
      this.endpoint = process.env.OPENAI_ENDPOINT;
      this.apiKey = process.env.OPENAI_API_KEY;
      this.modelName = process.env.MODEL_NAME || 'gpt-4';
      this.apiVersion = process.env.OPENAI_API_VERSION || '2024-08-01-preview';
    } else if (this.provider === 'GEMINI') {
      this.apiKey = process.env.GEMINI_API_KEY;
      this.modelName = 'gemini-1.5-flash';
    }
  }

  validateSQLQuery(query) {
    if (!query || typeof query !== 'string') {
      return false;
    }

    const normalizedQuery = query
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    const dangerousKeywords = [
      'drop', 'delete', 'insert', 'update', 'alter', 'create', 'truncate',
      'exec', 'execute', 'sp_', 'xp_', 'pragma', 'attach', 'detach'
    ];

    for (const keyword of dangerousKeywords) {
      if (normalizedQuery.includes(keyword)) {
        return false;
      }
    }

    if (!normalizedQuery.startsWith('select') && !normalizedQuery.startsWith('with')) {
      return false;
    }

    let parenthesesCount = 0;
    for (const char of normalizedQuery) {
      if (char === '(') parenthesesCount++;
      if (char === ')') parenthesesCount--;
      if (parenthesesCount < 0) return false;
    }

    return parenthesesCount === 0;
  }

  generateSystemMessage(schemas) {
    return `You are an expert SQL query generator. Convert natural language queries to SQL.

Database Schema:
${JSON.stringify(schemas, null, 2)}

Instructions:
1. Generate only SELECT queries (no INSERT, UPDATE, DELETE, DROP, etc.)
2. Use proper SQL syntax and formatting
3. Include appropriate WHERE clauses, JOINs, and ORDER BY when needed
4. Provide detailed reasoning for your query choices
5. Suggest appropriate visualizations for the results

Response format (JSON):
{
  "query": "Generated SQL query",
  "error": null,
  "decision_log": {
    "query_input_details": ["Analysis of user input"],
    "preprocessing_steps": ["Steps taken to understand the query"],
    "path_identification": [
      {
        "description": "Description of query approach",
        "tables": ["table1", "table2"],
        "columns": [["col1", "col2"], ["col3", "col4"]],
        "score": 95
      }
    ],
    "ambiguity_detection": ["Any ambiguities found"],
    "resolution_criteria": ["How ambiguities were resolved"],
    "chosen_path_explanation": [
      {
        "table": "table_name",
        "columns": ["selected_columns"],
        "reason": "Why these columns were chosen"
      }
    ],
    "generated_sql_query": "The final SQL query",
    "alternative_paths": ["Alternative approaches considered"],
    "execution_feedback": ["Expected results or potential issues"],
    "final_summary": "Summary of the analysis",
    "visualization_suggestion": "Recommended chart type"
  }
}`;
  }

  async generateSQLQuery(naturalLanguageQuery, schemas, userProvider = null, userApiKey = null) {
    try {
      const systemMessage = this.generateSystemMessage(schemas);
      
      // Use user-provided credentials if available, otherwise fall back to environment
      const provider = userProvider || this.provider;
      const apiKey = userApiKey || (provider === 'GEMINI' ? this.apiKey : this.apiKey);
      
      if (provider === 'AZURE' || provider === 'OPENAI') {
        return await this.generateWithOpenAI(systemMessage, naturalLanguageQuery, apiKey, userProvider === 'OPENAI');
      } else if (provider === 'GEMINI') {
        return await this.generateWithGemini(systemMessage, naturalLanguageQuery, apiKey);
      } else {
        throw new Error('No LLM provider configured');
      }
    } catch (error) {
      console.error('LLM query generation error:', error);
      return {
        query: null,
        error: `Failed to generate SQL query: ${error.message}`,
        decision_log: {
          query_input_details: [naturalLanguageQuery],
          execution_feedback: [`Error: ${error.message}`],
          final_summary: "Query generation failed due to an error"
        }
      };
    }
  }

  async generateWithOpenAI(systemMessage, userQuery, apiKey, isDirectOpenAI = false) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    let url, headers;
    
    if (isDirectOpenAI) {
      // Direct OpenAI API
      url = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
    } else {
      // Azure OpenAI (existing logic)
      if (!this.endpoint) {
        throw new Error('Azure OpenAI endpoint configuration missing');
      }
      url = `${this.endpoint}/openai/deployments/${this.modelName}/chat/completions?api-version=${this.apiVersion}`;
      headers = {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      };
    }
    
    const response = await axios.post(url, {
      model: isDirectOpenAI ? 'gpt-3.5-turbo' : undefined,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userQuery }
      ],
      max_tokens: 2000,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }, {
      headers,
      timeout: 30000
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  }

  async generateWithGemini(systemMessage, userQuery, apiKey = null) {
    const geminiApiKey = apiKey || this.apiKey;
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    
    const prompt = `${systemMessage}\n\nUser Query: ${userQuery}\n\nPlease respond with valid JSON only.`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2000
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const content = response.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  generateQuerySuggestions(schemas) {
    const suggestions = [];
    const tableNames = Object.keys(schemas);

    if (tableNames.length === 0) {
      return suggestions;
    }

    // Generate basic suggestions based on schema
    suggestions.push(`Show all data from ${tableNames[0]} table`);
    
    if (tableNames.length > 1) {
      suggestions.push(`Find relationships between ${tableNames[0]} and ${tableNames[1]}`);
    }

    // Look for common column patterns
    const allColumns = [];
    Object.values(schemas).forEach(schema => {
      allColumns.push(...Object.keys(schema));
    });

    const uniqueColumns = [...new Set(allColumns)];
    
    // Suggest queries based on common column names
    if (uniqueColumns.some(col => col.toLowerCase().includes('name'))) {
      suggestions.push('Show all unique names');
    }
    
    if (uniqueColumns.some(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time'))) {
      suggestions.push('Show records from the last 30 days');
    }
    
    if (uniqueColumns.some(col => col.toLowerCase().includes('price') || col.toLowerCase().includes('amount'))) {
      suggestions.push('Calculate average price/amount');
    }
    
    if (uniqueColumns.some(col => col.toLowerCase().includes('status'))) {
      suggestions.push('Group by status');
    }

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
}

module.exports = LLMService;
