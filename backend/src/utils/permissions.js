const Project = require('../models/Project');
const Task = require('../models/Task');
const Team = require('../models/Team');

const isProjectOwner = (project, userId) =>
  project.owner.toString() === userId.toString();

const isProjectMember = (project, userId) => {
  const uid = userId.toString();
  if (isProjectOwner(project, uid)) return true;
  return project.members.some((m) => m.toString() === uid);
};

const canViewProject = (project, userId) => isProjectMember(project, userId);

const canEditProject = (project, userId) => isProjectOwner(project, userId);

const canChangeTaskStatus = (task, project, userId) => {
  const uid = userId.toString();
  if (isProjectOwner(project, uid)) return true;
  if (task.assignedTo && task.assignedTo.toString() === uid) return true;
  return false;
};

const canEditTask = async (taskId, userId) => {
  const task = await Task.findById(taskId).populate('project');
  if (!task || !task.project) return { allowed: false, task: null, project: null };
  const project = task.project;
  if (!isProjectMember(project, userId)) {
    return { allowed: false, task, project };
  }
  return { allowed: true, task, project };
};

const isTeamOwner = (team, userId) =>
  team.owner.toString() === userId.toString();

const isTeamMember = (team, userId) => {
  const uid = userId.toString();
  if (isTeamOwner(team, uid)) return true;
  return team.members.some((m) => m.toString() === uid);
};

const canViewTeam = (team, userId) => {
  if (team.visibility === 'public') return true;
  return isTeamMember(team, userId);
};

const canManageTeamMembers = (team, userId) => isTeamOwner(team, userId);

const getProjectById = async (projectId) => Project.findById(projectId);

const getTeamById = async (teamId) => Team.findById(teamId);

module.exports = {
  isProjectOwner,
  isProjectMember,
  canViewProject,
  canEditProject,
  canChangeTaskStatus,
  canEditTask,
  isTeamOwner,
  isTeamMember,
  canViewTeam,
  canManageTeamMembers,
  getProjectById,
  getTeamById,
};
