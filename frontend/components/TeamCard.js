'use client';

import styles from '../styles/components.module.css';

export default function TeamCard({ team, onAddMember, onRemoveMember, currentUserId }) {
  const isOwner = team.owner?._id === currentUserId || team.owner === currentUserId;

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{team.name}</h3>
      <p className={styles.cardMeta}>{team.description}</p>
      <p className={styles.cardMeta}>
        Visibility: {team.visibility} · Members: {team.members?.length || 0}
      </p>
      {team.projects?.length > 0 && (
        <p className={styles.cardMeta}>
          Projects: {team.projects.map((p) => p.title || p).join(', ')}
        </p>
      )}
      <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
        {team.members?.map((m) => (
          <li key={m._id}>
            {m.name}
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
