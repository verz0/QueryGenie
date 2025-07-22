// api/database/schemas.js
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

    const schemas = await getSQLiteSchemas(dbPath);
    res.json(schemas);

  } catch (error) {
    console.error('Schema retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve database schemas: ' + error.message });
  }
}

async function getSQLiteSchemas(dbPath) {
  let db;
  try {
    db = new Database(dbPath, { readonly: true });
    
    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    
    const schemas = {};
    
    for (const table of tables) {
      try {
        // Get column information for each table
        const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
        
        schemas[table.name] = columns.map(col => ({
          name: col.name,
          type: col.type,
          nullable: !col.notnull,
          primary_key: col.pk === 1
        }));
      } catch (error) {
        console.error(`Error getting columns for table ${table.name}:`, error);
        schemas[table.name] = [];
      }
    }
    
    return schemas;
  } catch (error) {
    throw new Error(`Failed to retrieve SQLite schemas: ${error.message}`);
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
