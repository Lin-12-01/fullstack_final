const request = require('supertest');
const createApp = require('../../app');
const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

const app = createApp();

describe('Auth routes', () => {
  it('POST /api/auth/register creates user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New User', email: 'new@example.com', password: 'secret12' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe('new@example.com');
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/login returns 401 for wrong password', async () => {
    await User.create({
      name: 'Login User',
      email: 'login@example.com',
      passwordHash: 'correctpass',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('GET /api/auth/me returns user when authenticated', async () => {
    const user = await User.create({
      name: 'Me User',
      email: 'me@example.com',
      passwordHash: 'password123',
    });
    const token = generateToken(user._id);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@example.com');
  });
});
