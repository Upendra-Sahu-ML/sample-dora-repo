const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
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
app.use((err, req, res, next) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DevLake Demo Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
});

module.exports = app;