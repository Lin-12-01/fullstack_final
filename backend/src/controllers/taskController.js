const Task = require('../models/Task');
const Project = require('../models/Project');
const {
  canViewProject,
  canEditProject,
  canChangeTaskStatus,
  canEditTask,
  getProjectById,
} = require('../utils/permissions');

const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email avatarUrl')
    .populate('createdBy', 'name email')
    .populate('project', 'title owner members');

const broadcastTask = (req, type, task, project) => {
  if (req.app.locals.wsBroadcast) {
    const memberIds = [
      project.owner.toString(),
      ...project.members.map((m) => m.toString()),
    ];
    req.app.locals.wsBroadcast({
      type,
      task,
      projectId: project._id.toString(),
      memberIds: [...new Set(memberIds)],
    });
  }
};

const createTask = async (req, res) => {
  const project = await getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!canViewProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { title, description, status, priority, dueDate, assignedTo, attachmentUrl } =
    req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    attachmentUrl,
    project: project._id,
    createdBy: req.user._id,
  });

  const populated = await populateTask(Task.findById(task._id));
  broadcastTask(req, 'task:created', populated, project);
  res.status(201).json(populated);
};

const getProjectTasks = async (req, res) => {
  const project = await getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!canViewProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const tasks = await populateTask(
    Task.find({ project: project._id }).sort({ createdAt: -1 })
  );
  res.json(tasks);
};

const getTaskById = async (req, res) => {
  const task = await populateTask(Task.findById(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  const project = await getProjectById(task.project._id || task.project);
  if (!canViewProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(task);
};

const updateTask = async (req, res) => {
  const { allowed, task, project } = await canEditTask(req.params.id, req.user._id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (!allowed) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (req.body.status !== undefined) {
    if (!canChangeTaskStatus(task, project, req.user._id)) {
      return res.status(403).json({
        message: 'Only project owner or assigned user can change task status',
      });
    }
    task.status = req.body.status;
  }

  const fields = ['title', 'description', 'priority', 'dueDate', 'assignedTo', 'attachmentUrl'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      if (canEditProject(project, req.user._id) || f === 'attachmentUrl') {
        task[f] = req.body[f];
      }
    }
  });

  await task.save();
  const populated = await populateTask(Task.findById(task._id));
  broadcastTask(req, 'task:updated', populated, project);

  if (req.body.assignedTo) {
    broadcastTask(req, 'notification:task-assigned', populated, project);
  }

  res.json(populated);
};

const deleteTask = async (req, res) => {
  const { allowed, task, project } = await canEditTask(req.params.id, req.user._id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (!canEditProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Only project owner can delete tasks' });
  }

  await task.deleteOne();
  broadcastTask(req, 'task:deleted', { _id: req.params.id }, project);
  res.json({ message: 'Task removed' });
};

const searchTasks = async (req, res) => {
  const { query, status, priority } = req.query;
  const userProjects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  }).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const filter = { project: { $in: projectIds } };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  const tasks = await populateTask(Task.find(filter).sort({ updatedAt: -1 }));
  res.json(tasks);
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
};
