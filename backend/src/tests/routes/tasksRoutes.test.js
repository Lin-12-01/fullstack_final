const request = require('supertest');
const createApp = require('../../app');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const generateToken = require('../../utils/generateToken');

const app = createApp();

describe('Tasks API', () => {
  let token;
  let user;
  let project;

  beforeEach(async () => {
    user = await User.create({
      name: 'Task User',
      email: `task${Date.now()}@example.com`,
      passwordHash: 'password123',
    });
    token = generateToken(user._id);
    project = await Project.create({
      title: 'Task Project',
      owner: user._id,
      members: [user._id],
    });
  });

  it('POST /api/projects/:projectId/tasks creates task', async () => {
    const res = await request(app)
      .post(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Task', description: 'Do it' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
  });

  it('GET /api/projects/:projectId/tasks lists tasks', async () => {
    await Task.create({
      title: 'Listed Task',
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app)
      .get(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/tasks/search finds tasks by query', async () => {
    await Task.create({
      title: 'UniqueSearchTask',
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app)
      .get('/api/tasks/search')
      .query({ query: 'UniqueSearch' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some((t) => t.title.includes('UniqueSearch'))).toBe(true);
  });
});
