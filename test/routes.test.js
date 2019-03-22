import request from 'supertest';
import app from '../src/app';

describe('Routes', () => {
  it('should have roles route', async () => {
    const response = await request(app).get('/api/roles');
    expect(response.statusCode).toBe(200);
  });

  it('should render Hello World', async () => {
    const response = await request(app).get('/api/roles');
    expect(response.body).toEqual({ tags: 'Hello world' });
  });
});
