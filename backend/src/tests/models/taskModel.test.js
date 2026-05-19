const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

describe('Task Model', () => {
  let ownerId;
  let projectId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Creator',
      email: 'creator@example.com',
      passwordHash: 'password123',
    });
    ownerId = user._id;
    const project = await Project.create({
      title: 'Task Project',
      owner: ownerId,
    });
    projectId = project._id;
  });

  it('should require title, project and createdBy', async () => {
    const task = new Task({});
    let err;
    try {
      await task.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.title).toBeDefined();
    expect(err.errors.project).toBeDefined();
    expect(err.errors.createdBy).toBeDefined();
  });

  it('should create task with default status todo', async () => {
    const task = await Task.create({
      title: 'First Task',
      project: projectId,
      createdBy: ownerId,
    });
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
  });
});
