const Project = require('../models/Project');
const Task = require('../models/Task');
const {
  canViewProject,
  canEditProject,
  getProjectById,
} = require('../utils/permissions');

const populateProject = (query) =>
  query
    .populate('owner', 'name email avatarUrl')
    .populate('members', 'name email avatarUrl');

const createProject = async (req, res) => {
  const { title, description, status, priority, tags, coverImageUrl } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const project = await Project.create({
    title,
    description,
    status,
    priority,
    tags,
    coverImageUrl,
    owner: req.user._id,
    members: [req.user._id],
  });

  const populated = await populateProject(Project.findById(project._id));
  res.status(201).json(populated);
};

const getProjects = async (req, res) => {
  const projects = await populateProject(
    Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).sort({ updatedAt: -1 })
  );
  res.json(projects);
};

const getProjectByIdHandler = async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!canViewProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to view this project' });
  }
  const populated = await populateProject(Project.findById(project._id));
  res.json(populated);
};

const updateProject = async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!canEditProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this project' });
  }

  const fields = ['title', 'description', 'status', 'priority', 'tags', 'coverImageUrl'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) project[f] = req.body[f];
  });

  await project.save();
  const populated = await populateProject(Project.findById(project._id));
  res.json(populated);
};

const deleteProject = async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!canEditProject(project, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this project' });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: 'Project removed' });
};

const searchProjects = async (req, res) => {
  const { query, status, priority } = req.query;
  const filter = {
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (query) {
    filter.$and = [
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      },
    ];
  }

  const projects = await populateProject(
    Project.find(filter).sort({ updatedAt: -1 })
  );
  res.json(projects);
};

module.exports = {
  createProject,
  getProjects,
  getProjectById: getProjectByIdHandler,
  updateProject,
  deleteProject,
  searchProjects,
};
