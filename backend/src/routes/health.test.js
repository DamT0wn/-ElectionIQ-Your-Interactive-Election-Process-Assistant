const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('returns 200 with healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('ElectionIQ API');
    expect(res.body.timestamp).toBeDefined();
  });
});
