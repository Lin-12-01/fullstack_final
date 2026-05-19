const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const request = async (endpoint, options = {}) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  register: (body) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/me'),
  updateProfile: (body) =>
    request('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  updateAvatar: (avatarUrl) =>
    request('/api/users/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatarUrl }),
    }),
  getProjects: () => request('/api/projects'),
  searchProjects: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/projects/search?${q}`);
  },
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (body) =>
    request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) =>
    request(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProject: (id) =>
    request(`/api/projects/${id}`, { method: 'DELETE' }),
  getProjectTasks: (projectId) => request(`/api/projects/${projectId}/tasks`),
  createTask: (projectId, body) =>
    request(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateTask: (id, body) =>
    request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
  searchTasks: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/tasks/search?${q}`);
  },
  getTeams: () => request('/api/teams'),
  createTeam: (body) =>
    request('/api/teams', { method: 'POST', body: JSON.stringify(body) }),
  updateTeam: (id, body) =>
    request(`/api/teams/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTeam: (id) => request(`/api/teams/${id}`, { method: 'DELETE' }),
  addTeamMember: (id, body) =>
    request(`/api/teams/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  removeTeamMember: (id, userId) =>
    request(`/api/teams/${id}/members/${userId}`, { method: 'DELETE' }),
};

export default api;
