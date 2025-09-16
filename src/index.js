const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Enhanced health check endpoint for monitoring
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
    },
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version
  };

  res.status(200).json(healthStatus);
});

// Detailed health check with dependency checks
app.get('/health/detailed', (req, res) => {
  const dependencies = {
    database: { status: 'healthy', responseTime: Math.floor(Math.random() * 50) + 'ms' },
    cache: { status: 'healthy', responseTime: Math.floor(Math.random() * 20) + 'ms' },
    externalApi: { status: 'healthy', responseTime: Math.floor(Math.random() * 100) + 'ms' }
  };

  const overall = Object.values(dependencies).every(dep => dep.status === 'healthy') ? 'healthy' : 'degraded';

  res.status(overall === 'healthy' ? 200 : 503).json({
    status: overall,
    timestamp: new Date().toISOString(),
    dependencies,
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'DevLake Demo API is running',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

app.get('/api/metrics', (req, res) => {
  const metrics = {
    requests_total: Math.floor(Math.random() * 1000),
    response_time_ms: Math.floor(Math.random() * 100),
    error_rate: Math.random() * 0.05,
    active_users: Math.floor(Math.random() * 50),
    timestamp: new Date().toISOString()
  };

  res.json(metrics);
});

// Simulate some business logic
app.post('/api/process', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  // Simulate processing delay
  setTimeout(() => {
    res.json({
      message: 'Data processed successfully',
      processed_data: data.toUpperCase(),
      timestamp: new Date().toISOString()
    });
  }, Math.random() * 1000);
});

// Error handling middleware
app.use((err, req, res, _next) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'Please check your request body'
    });
  }

  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server only if this file is run directly (not required)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 DevLake Demo Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
  });
}

module.exports = app;