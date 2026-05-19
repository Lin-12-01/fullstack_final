'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/components.module.css';

export default function TeamCard({
  team,
  onAddMember,
  onRemoveMember,
  onCreateProject,
  currentUserId,
}) {
  const isOwner = team.owner?._id === currentUserId || team.owner === currentUserId;
  const [projectTitle, setProjectTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !onCreateProject) return;
    setCreating(true);
    try {
      await onCreateProject(team._id, {
        title: projectTitle.trim(),
        status: 'planning',
        priority: 'medium',
      });
      setProjectTitle('');
    } finally {
      setCreating(false);
    }
  };

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{team.name}</h3>
      <p className={styles.cardMeta}>{team.description}</p>
      <p className={styles.cardMeta}>
        Visibility: {team.visibility} · Members: {team.members?.length || 0}
      </p>

      <div style={{ marginTop: '0.75rem' }}>
        <strong>Team Projects</strong>
        {team.projects?.length > 0 ? (
          <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
            {team.projects.map((p) => (
              <li key={p._id}>
                <Link href={`/projects/${p._id}`}>{p.title}</Link>
                <span className={styles.cardMeta} style={{ marginLeft: 8 }}>
                  ({p.status})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.cardMeta}>No projects yet</p>
        )}
      </div>

      {isOwner && onCreateProject && (
        <form onSubmit={handleCreateProject} style={{ marginTop: '0.75rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor={`project-${team._id}`}>Create project for team</label>
            <input
              id={`project-${team._id}`}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project title"
              required
            />
          </div>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Team Project'}
          </button>
        </form>
      )}

      <ul style={{ paddingLeft: '1.2rem', margin: '1rem 0 0.5rem' }}>
        <strong>Members</strong>
        {team.members?.map((m) => (
          <li key={m._id} style={{ marginTop: 4 }}>
            {m.name}
            {m._id === team.owner?._id && ' (owner)'}
            {isOwner && m._id !== team.owner?._id && onRemoveMember && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                style={{ marginLeft: 8, padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => onRemoveMember(team._id, m._id)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && onAddMember && (
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => onAddMember(team._id)}
        >
          Add Member
        </button>
      )}
    </article>
  );
}