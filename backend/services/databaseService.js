const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

class DatabaseService {
  constructor() {
    this.validateSQLQuery = this.validateSQLQuery.bind(this);
  }

  // Validate SQL query for security
  validateSQLQuery(query) {
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

  // SQLite operations
  async getSQLiteSchemas(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          reject(new Error(`Failed to open SQLite database: ${err.message}`));
          return;
        }
      });

      const schemas = {};

      // Get all table names
      db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, tables) => {
        if (err) {
          db.close();
          reject(new Error(`Failed to get table names: ${err.message}`));
          return;
        }

        let completed = 0;
        const totalTables = tables.length;

        if (totalTables === 0) {
          db.close();
          resolve(schemas);
          return;
        }

        tables.forEach(table => {
          // Get column information for each table
          db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
            if (err) {
              console.error(`Error getting schema for table ${table.name}:`, err);
            } else {
              schemas[table.name] = {};
              columns.forEach(column => {
                schemas[table.name][column.name] = column.type;
              });
            }

            completed++;
            if (completed === totalTables) {
              db.close();
              resolve(schemas);
            }
          });
        });
      });
    });
  }

  async executeSQLiteQuery(dbPath, query) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          reject(new Error(`Failed to open SQLite database: ${err.message}`));
          return;
        }
      });

      db.all(query, (err, rows) => {
        db.close();
        
        if (err) {
          reject(new Error(`Query execution failed: ${err.message}`));
          return;
        }

        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        resolve({
          data: rows,
          columns: columns,
          rowCount: rows.length
        });
      });
    });
  }

  // PostgreSQL operations
  async getPostgreSQLSchemas(host, database, username, password) {
    const client = new Client({
      host: host,
      database: database,
      user: username,
      password: password,
      port: 5432,
      ssl: false,
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();

      // Get all table names and their column information
      const tablesQuery = `
        SELECT 
          table_name,
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        ORDER BY table_name, ordinal_position
      `;

      const result = await client.query(tablesQuery);
      const schemas = {};

      result.rows.forEach(row => {
        if (!schemas[row.table_name]) {
          schemas[row.table_name] = {};
        }
        schemas[row.table_name][row.column_name] = row.data_type;
      });

      return schemas;

    } catch (error) {
      throw new Error(`PostgreSQL schema retrieval failed: ${error.message}`);
    } finally {
      await client.end();
    }
  }

  async executePostgreSQLQuery(host, database, username, password, query) {
    const client = new Client({
      host: host,
      database: database,
      user: username,
      password: password,
      port: 5432,
      ssl: false,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000, // 30 seconds query timeout
    });

    try {
      await client.connect();
      const result = await client.query(query);

      const columns = result.fields ? result.fields.map(field => field.name) : [];
      
      return {
        data: result.rows,
        columns: columns,
        rowCount: result.rowCount
      };

    } catch (error) {
      throw new Error(`PostgreSQL query execution failed: ${error.message}`);
    } finally {
      await client.end();
    }
  }

  async testPostgreSQLConnection(host, database, username, password) {
    const client = new Client({
      host: host,
      database: database,
      user: username,
      password: password,
      port: 5432,
      ssl: false,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('PostgreSQL connection test failed:', error.message);
      return false;
    } finally {
      try {
        await client.end();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}

module.exports = DatabaseService;
