const express = require('express');
const router = express.Router();

// Store API configuration temporarily (in production, use secure storage)
let apiConfig = {
  provider: process.env.LLM_PROVIDER || 'GEMINI',
  apiKey: null,
  configured: false
};

// Set API Key configuration
router.post('/api-key', (req, res) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider || !apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Provider and API key are required'
      });
    }

    // Validate provider
    const validProviders = ['GEMINI', 'OPENAI'];
    if (!validProviders.includes(provider.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider. Must be GEMINI or OPENAI'
      });
    }

    // Validate API key format
    if (provider.toUpperCase() === 'GEMINI' && !apiKey.startsWith('AIza')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Gemini API key format. Should start with "AIza"'
      });
    }

    if (provider.toUpperCase() === 'OPENAI' && !apiKey.startsWith('sk-')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OpenAI API key format. Should start with "sk-"'
      });
    }

    // Store configuration
    apiConfig = {
      provider: provider.toUpperCase(),
      apiKey: apiKey,
      configured: true
    };

    // Set environment variables for current session
    process.env.LLM_PROVIDER = provider.toUpperCase();
    if (provider.toUpperCase() === 'GEMINI') {
      process.env.GEMINI_API_KEY = apiKey;
    } else if (provider.toUpperCase() === 'OPENAI') {
      process.env.OPENAI_API_KEY = apiKey;
    }

    console.log(`API configuration updated: Provider=${provider}, Configured=true`);

    res.json({
      success: true,
      message: 'API key configured successfully',
      provider: provider.toUpperCase()
    });

  } catch (error) {
    console.error('Error configuring API key:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current API configuration status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    configured: apiConfig.configured,
    provider: apiConfig.provider,
    hasApiKey: !!apiConfig.apiKey
  });
});

// Clear API configuration
router.delete('/api-key', (req, res) => {
  try {
    apiConfig = {
      provider: 'GEMINI',
      apiKey: null,
      configured: false
    };

    // Clear environment variables
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    console.log('API configuration cleared');

    res.json({
      success: true,
      message: 'API configuration cleared'
    });

  } catch (error) {
    console.error('Error clearing API configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Export the current configuration for use in other modules
const getApiConfig = () => apiConfig;

module.exports = {
  router,
  getApiConfig
};
