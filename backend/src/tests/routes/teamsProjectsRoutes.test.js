const request = require('supertest');
const createApp = require('../../app');
const User = require('../../models/User');
const Team = require('../../models/Team');
const Project = require('../../models/Project');
const generateToken = require('../../utils/generateToken');

const app = createApp();

describe('Team projects API', () => {
  let ownerToken;
  let memberToken;
  let owner;
  let member;
  let team;

  beforeEach(async () => {
    owner = await User.create({
      name: 'Team Owner',
      email: `owner${Date.now()}@test.com`,
      passwordHash: 'password123',
    });
    member = await User.create({
      name: 'Team Member',
      email: `member${Date.now()}@test.com`,
      passwordHash: 'password123',
    });
    ownerToken = generateToken(owner._id);
    memberToken = generateToken(member._id);
    team = await Team.create({
      name: 'Test Team',
      owner: owner._id,
      members: [owner._id, member._id],
    });
  });

  it('POST /api/teams/:id/projects creates project for all members', async () => {
    const res = await request(app)
      .post(`/api/teams/${team._id}/projects`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Team Project' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Team Project');
    expect(res.body.members.length).toBe(2);

    const updatedTeam = await Team.findById(team._id);
    expect(updatedTeam.projects.length).toBe(1);
  });

  it('member can view team project', async () => {
    const project = await Project.create({
      title: 'Shared',
      owner: owner._id,
      members: [owner._id, member._id],
    });
    team.projects.push(project._id);
    await team.save();

    const res = await request(app)
      .get(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Shared');
  });

  it('non-owner cannot create team project', async () => {
    const res = await request(app)
      .post(`/api/teams/${team._id}/projects`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ title: 'Forbidden' });

    expect(res.status).toBe(403);
  });
});