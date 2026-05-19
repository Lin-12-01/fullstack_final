'use client';

import styles from '../styles/components.module.css';

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const statusClass =
    task.status === 'done'
      ? styles.badgeDone
      : task.status === 'in-progress'
        ? styles.badgeProgress
        : styles.badgeTodo;

  return (
    <article className={styles.card} data-testid="task-card">
      <h3 className={styles.cardTitle}>{task.title}</h3>
      <p className={styles.cardMeta}>{task.description}</p>
      <div>
        <span className={`${styles.badge} ${statusClass}`}>{task.status}</span>
        <span className={`${styles.badge} ${styles.badgeMedium}`} style={{ marginLeft: 8 }}>
          {task.priority}
        </span>
      </div>
      {task.assignedTo && (
        <p className={styles.cardMeta}>
          Assigned: {task.assignedTo.name || task.assignedTo.email}
        </p>
      )}
      {task.attachmentUrl && (
        <p className={styles.cardMeta}>
          <a href={task.attachmentUrl} target="_blank" rel="noreferrer">
            View attachment
          </a>
        </p>
      )}
      {(onStatusChange || onDelete) && (
        <div className={styles.actions}>
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          )}
          {onDelete && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
