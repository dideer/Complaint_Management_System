const request = require('supertest');
const app = require('../index');

describe('Complaint API', () => {
  test('GET /api/complaints should return array', async () => {
    const res = await request(app).get('/api/complaints');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/complaints should create complaint', async () => {
    const complaint = {
      title: 'Test Complaint',
      description: 'This is a test',
      category: 'IT',
      priority: 'High'
    };
    const res = await request(app).post('/api/complaints').send(complaint);
    expect(res.statusCode).toBe(201);
  });
});
