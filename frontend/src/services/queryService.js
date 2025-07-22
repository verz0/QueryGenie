import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class QueryService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log('Making request to:', config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API Error:', error);
        if (error.response) {
          throw new Error(error.response.data.error || 'Server error');
        } else if (error.request) {
          throw new Error('Network error - please check your connection');
        } else {
          throw new Error('Request failed');
        }
      }
    );
  }

  async uploadDatabase(file) {
    const formData = new FormData();
    formData.append('database', file);

    return await this.api.post('/database/upload-database', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getSchemas(dbConfig) {
    if (dbConfig.type === 'SQLite' && dbConfig.file) {
      const uploadResponse = await this.uploadDatabase(dbConfig.file);
      return await this.api.post('/database/schemas', {
        db_type: 'sqlite',
        db_name: uploadResponse.filename
      });
    } else if (dbConfig.type === 'PostgreSQL') {
      return await this.api.post('/database/schemas', {
        db_type: 'postgresql',
        db_name: dbConfig.dbName,
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password
      });
    }
    throw new Error('Invalid database configuration');
  }

  async generateSQLQuery(naturalLanguageQuery, schemas) {
    // Get user's API configuration from localStorage
    const provider = localStorage.getItem('llm_provider');
    const apiKey = localStorage.getItem('api_key');
    
    const payload = {
      query: naturalLanguageQuery,
      schemas: schemas
    };
    
    // Include user's API key if available
    if (provider && apiKey) {
      payload.provider = provider;
      payload.apiKey = apiKey;
    }
    
    return await this.api.post('/query/generate-query', payload);
  }

  async executeQuery(sqlQuery, dbConfig) {
    const payload = {
      sql_query: sqlQuery
    };

    if (dbConfig.type === 'SQLite') {
      payload.db_type = 'sqlite';
      payload.db_name = 'temp_database.db'; // This should match backend temp file naming
    } else if (dbConfig.type === 'PostgreSQL') {
      payload.db_type = 'postgresql';
      payload.db_name = dbConfig.dbName;
      payload.host = dbConfig.host;
      payload.user = dbConfig.user;
      payload.password = dbConfig.password;
    }

    return await this.api.post('/database/execute-query', payload);
  }

  async testConnection(dbConfig) {
    if (dbConfig.type === 'PostgreSQL') {
      return await this.api.post('/database/test-connection', {
        db_type: 'postgresql',
        db_name: dbConfig.dbName,
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password
      });
    }
    throw new Error('Connection test only available for PostgreSQL');
  }

  async getQueryHistory() {
    // Query history not implemented in backend yet
    return [];
    // return await this.api.get('/query/history');
  }

  async saveQueryHistory(query, sqlQuery, results) {
    // Query history not implemented in backend yet
    return { success: true };
    // return await this.api.post('/query/history', {
    //   query,
    //   sql_query: sqlQuery,
    //   results_count: results?.length || 0,
    //   timestamp: new Date().toISOString()
    // });
  }

  async exportResults(data, format) {
    return await this.api.post('/export/results', {
      data,
      format
    }, {
      responseType: 'blob'
    });
  }

  async getSystemStatus() {
    return await this.api.get('/status');
  }
}

export const queryService = new QueryService();
