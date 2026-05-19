'use client';

import Link from 'next/link';
import styles from '../styles/components.module.css';

export default function ProjectCard({ project, onDelete }) {
  const priorityClass =
    project.priority === 'high' || project.priority === 'urgent'
      ? styles.badgeHigh
      : project.priority === 'low'
        ? styles.badgeLow
        : styles.badgeMedium;

  return (
    <article className={styles.card}>
      {project.coverImageUrl && (
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className={styles.coverImage}
        />
      )}
      <h3 className={styles.cardTitle}>
        <Link href={`/projects/${project._id}`}>{project.title}</Link>
      </h3>
      <p className={styles.cardMeta}>{project.description?.slice(0, 100)}</p>
      <div>
        <span className={`${styles.badge} ${priorityClass}`}>{project.priority}</span>
        <span className={`${styles.badge} ${styles.badgeTodo}`} style={{ marginLeft: 8 }}>
          {project.status}
        </span>
      </div>
      {onDelete && (
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => onDelete(project._id)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
