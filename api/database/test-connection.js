// api/database/test-connection.js
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
    const { tempPath, filename } = req.body;

    if (!tempPath && !filename) {
      return res.status(400).json({ error: 'Database file path is required' });
    }

    const dbPath = tempPath || `/tmp/${filename}`;
    
    if (!fs.existsSync(dbPath)) {
      return res.status(400).json({ error: 'Database file not found' });
    }

    const isConnected = await testSQLiteConnection(dbPath);
    
    if (isConnected) {
      res.json({ success: true, message: 'Database connection successful' });
    } else {
      res.status(400).json({ error: 'Failed to connect to database' });
    }

  } catch (error) {
    console.error('Database connection test error:', error);
    res.status(500).json({ error: 'Connection test failed: ' + error.message });
  }
}

async function testSQLiteConnection(dbPath) {
  let db;
  try {
    db = new Database(dbPath, { readonly: true });
    
    // Test connection with a simple query
    const result = db.prepare('SELECT 1 as test').get();
    
    return result && result.test === 1;
  } catch (error) {
    console.error('SQLite connection test failed:', error);
    return false;
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
