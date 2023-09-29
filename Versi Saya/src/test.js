import request from 'supertest';
import app from './app';
describe('Test Endpoint /data', () => {
  it('should return status code 200', async () => {
    const res = await request(app).get('/data');
    expect(res.statusCode).toEqual(200);
  });

  it('should return JSON data', async () => {
    const res = await request(app).get('/data');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
