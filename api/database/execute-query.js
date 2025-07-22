// api/database/execute-query.js
import Database from 'better-sqlite3';
import fs from 'fs';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sql_query, tempPath, filename } = req.body;

    if (!sql_query) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // Validate SQL query for security
    if (!validateSQLQuery(sql_query)) {
      return res.status(400).json({ 
        error: 'Invalid or unsafe SQL query. Only SELECT queries are allowed.' 
      });
    }

    const dbPath = tempPath || `/tmp/${filename}`;
    
    if (!fs.existsSync(dbPath)) {
      return res.status(400).json({ error: 'Database file not found' });
    }

    const results = await executeSQLiteQuery(dbPath, sql_query);

    res.json(results);

  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ error: 'Failed to execute query: ' + error.message });
  }
}

function validateSQLQuery(query) {
  if (!query || typeof query !== 'string') {
    return false;
  }

  // Remove comments and normalize whitespace
  const normalizedQuery = query
    .replace(/--.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Check for dangerous keywords
  const dangerousKeywords = [
    'drop', 'delete', 'insert', 'update', 'alter', 'create', 'truncate',
    'exec', 'execute', 'sp_', 'xp_', 'pragma', 'attach', 'detach'
  ];

  for (const keyword of dangerousKeywords) {
    if (normalizedQuery.includes(keyword)) {
      return false;
    }
  }

  // Must start with SELECT or WITH (for CTEs)
  if (!normalizedQuery.startsWith('select') && !normalizedQuery.startsWith('with')) {
    return false;
  }

  // Check for balanced parentheses
  let parenthesesCount = 0;
  for (const char of normalizedQuery) {
    if (char === '(') parenthesesCount++;
    if (char === ')') parenthesesCount--;
    if (parenthesesCount < 0) return false;
  }

  return parenthesesCount === 0;
}

async function executeSQLiteQuery(dbPath, query) {
  let db;
  try {
    db = new Database(dbPath, { readonly: true });
    
    // Execute the query
    const stmt = db.prepare(query);
    const rows = stmt.all();
    
    return {
      rows: rows,
      rowCount: rows.length,
      columns: rows.length > 0 ? Object.keys(rows[0]) : []
    };
  } catch (error) {
    throw new Error(`Failed to execute SQLite query: ${error.message}`);
  } finally {
    if (db) {
      try {
        db.close();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}
