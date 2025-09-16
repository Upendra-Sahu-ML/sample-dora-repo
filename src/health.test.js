const request = require('supertest');
const app = require('./index');

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status with basic information', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('pid');
      expect(response.body).toHaveProperty('platform');
      expect(response.body).toHaveProperty('nodeVersion');
    });

    it('should return valid memory information', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(response.body.memory).toHaveProperty('rss');
      expect(typeof response.body.memory.used).toBe('number');
      expect(typeof response.body.memory.total).toBe('number');
      expect(typeof response.body.memory.rss).toBe('number');
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health status with dependencies', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('dependencies');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
    });

    it('should include dependency status checks', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body.dependencies).toHaveProperty('database');
      expect(response.body.dependencies).toHaveProperty('cache');
      expect(response.body.dependencies).toHaveProperty('externalApi');

      Object.values(response.body.dependencies).forEach(dependency => {
        expect(dependency).toHaveProperty('status');
        expect(dependency).toHaveProperty('responseTime');
      });
    });

    it('should return proper content type', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.status).toMatch(/healthy|degraded/);
    });
  });
});