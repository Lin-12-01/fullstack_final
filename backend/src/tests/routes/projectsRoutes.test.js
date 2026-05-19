const request = require('supertest');
const createApp = require('../../app');
const User = require('../../models/User');
const Project = require('../../models/Project');
const generateToken = require('../../utils/generateToken');

const app = createApp();

const createAuthUser = async () => {
  const user = await User.create({
    name: 'API User',
    email: `api${Date.now()}@example.com`,
    passwordHash: 'password123',
  });
  const token = generateToken(user._id);
  return { user, token };
};

describe('Projects API', () => {
  it('POST /api/projects creates a project', async () => {
    const { token } = await createAuthUser();

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Project', description: 'Desc' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Project');
  });

  it('GET /api/projects returns user projects', async () => {
    const { user, token } = await createAuthUser();
    await Project.create({ title: 'Listed', owner: user._id, members: [user._id] });

    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/projects/search filters by status', async () => {
    const { user, token } = await createAuthUser();
    await Project.create({
      title: 'Active One',
      status: 'active',
      owner: user._id,
      members: [user._id],
    });

    const res = await request(app)
      .get('/api/projects/search')
      .query({ status: 'active' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.status === 'active')).toBe(true);
  });
});
