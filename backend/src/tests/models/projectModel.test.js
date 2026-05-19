const mongoose = require('mongoose');
const User = require('../../models/User');
const Project = require('../../models/Project');

describe('Project Model', () => {
  let ownerId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Owner',
      email: 'owner@example.com',
      passwordHash: 'password123',
    });
    ownerId = user._id;
  });

  it('should require title and owner', async () => {
    const project = new Project({});
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.title).toBeDefined();
    expect(err.errors.owner).toBeDefined();
  });

  it('should create project with default status and priority', async () => {
    const project = await Project.create({
      title: 'My Project',
      owner: ownerId,
    });
    expect(project.status).toBe('planning');
    expect(project.priority).toBe('medium');
    expect(project.tags).toEqual([]);
  });
});
