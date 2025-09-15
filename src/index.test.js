const request = require('supertest');
const app = require('./index');

describe('DevLake Demo API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /api/status', () => {
    it('should return API status', async () => {
      const response = await request(app)
        .get('/api/status')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/metrics', () => {
    it('should return metrics data', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(response.body).toHaveProperty('requests_total');
      expect(response.body).toHaveProperty('response_time_ms');
      expect(response.body).toHaveProperty('error_rate');
      expect(response.body).toHaveProperty('active_users');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/process', () => {
    it('should process data successfully', async () => {
      const testData = 'hello world';

      const response = await request(app)
        .post('/api/process')
        .send({ data: testData })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Data processed successfully');
      expect(response.body).toHaveProperty('processed_data', testData.toUpperCase());
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return error for missing data', async () => {
      const response = await request(app)
        .post('/api/process')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Data is required');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/unknown-route');
    });
  });
});