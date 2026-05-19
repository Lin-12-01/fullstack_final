'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import TeamCard from '../../components/TeamCard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import styles from '../../styles/components.module.css';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', visibility: 'private' });
  const [memberEmail, setMemberEmail] = useState('');
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [error, setError] = useState('');

  const loadTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createTeam(form);
    setForm({ name: '', description: '', visibility: 'private' });
    loadTeams();
  };

  const handleAddMember = async (teamId) => {
    const email = prompt('Enter member email:');
    if (!email) return;
    await api.addTeamMember(teamId, { email });
    loadTeams();
  };

  const handleRemoveMember = async (teamId, userId) => {
    await api.removeTeamMember(teamId, userId);
    loadTeams();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete team?')) return;
    await api.deleteTeam(id);
    loadTeams();
  };

  const handleCreateProject = async (teamId, body) => {
    try {
      await api.createTeamProject(teamId, body);
      loadTeams();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Teams</h1>
          <p>Create and manage your teams</p>
        </div>
        <form className={styles.form} onSubmit={handleCreate}>
          <div className={styles.formGroup}>
            <label htmlFor="team-name">Team Name</label>
            <input
              id="team-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="team-desc">Description</label>
            <textarea
              id="team-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="team-vis">Visibility</label>
            <select
              id="team-vis"
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Create Team
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.grid} style={{ marginTop: '2rem' }}>
          {teams.map((team) => (
            <div key={team._id}>
              <TeamCard
                team={team}
                currentUserId={user?._id}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onCreateProject={handleCreateProject}
              />
              {team.owner?._id === user?._id && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger}`}
                  style={{ marginTop: 8 }}
                  onClick={() => handleDelete(team._id)}
                >
                  Delete Team
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      </ProtectedRoute>
  );
}