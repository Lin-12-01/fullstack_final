const Team = require('../models/Team');
const User = require('../models/User');
const {
  canViewTeam,
  canManageTeamMembers,
  isTeamOwner,
  getTeamById,
} = require('../utils/permissions');

const populateTeam = (query) =>
  query
    .populate('owner', 'name email avatarUrl')
    .populate('members', 'name email avatarUrl')
    .populate('projects', 'title status priority coverImageUrl');

const createTeam = async (req, res) => {
  const { name, description, visibility, avatarUrl, projects } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Team name is required' });
  }

  const team = await Team.create({
    name,
    description,
    visibility,
    avatarUrl,
    projects,
    owner: req.user._id,
    members: [req.user._id],
  });

  const populated = await populateTeam(Team.findById(team._id));
  res.status(201).json(populated);
};

const getTeams = async (req, res) => {
  const teams = await populateTeam(
    Team.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
        { visibility: 'public' },
      ],
    }).sort({ updatedAt: -1 })
  );
  res.json(teams);
};

const getTeamByIdHandler = async (req, res) => {
  const team = await getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }
  if (!canViewTeam(team, req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to view this team' });
  }
  const populated = await populateTeam(Team.findById(team._id));
  res.json(populated);
};

const updateTeam = async (req, res) => {
  const team = await getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }
  if (!isTeamOwner(team, req.user._id)) {
    return res.status(403).json({ message: 'Only team owner can update team' });
  }

  const fields = ['name', 'description', 'visibility', 'avatarUrl', 'projects'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) team[f] = req.body[f];
  });

  await team.save();
  const populated = await populateTeam(Team.findById(team._id));
  res.json(populated);
};

const deleteTeam = async (req, res) => {
  const team = await getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }
  if (!isTeamOwner(team, req.user._id)) {
    return res.status(403).json({ message: 'Only team owner can delete team' });
  }

  await team.deleteOne();
  res.json({ message: 'Team removed' });
};

const addMember = async (req, res) => {
  const team = await getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }
  if (!canManageTeamMembers(team, req.user._id)) {
    return res.status(403).json({ message: 'Only team owner can add members' });
  }

  const { userId, email } = req.body;
  let user;
  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email: email.toLowerCase() });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (team.members.some((m) => m.toString() === user._id.toString())) {
    return res.status(400).json({ message: 'User is already a member' });
  }

  team.members.push(user._id);
  await team.save();

  const populated = await populateTeam(Team.findById(team._id));
  res.json(populated);
};

const removeMember = async (req, res) => {
  const team = await getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }
  if (!canManageTeamMembers(team, req.user._id)) {
    return res.status(403).json({ message: 'Only team owner can remove members' });
  }

  const userId = req.params.userId;
  if (team.owner.toString() === userId) {
    return res.status(400).json({ message: 'Cannot remove team owner' });
  }

  team.members = team.members.filter((m) => m.toString() !== userId);
  await team.save();

  const populated = await populateTeam(Team.findById(team._id));
  res.json(populated);
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById: getTeamByIdHandler,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
};
