'use client';

import styles from '../styles/components.module.css';

export default function SearchFilterBar({ filters, onChange, onSearch }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        name="query"
        placeholder="Search..."
        value={filters.query || ''}
        onChange={handleChange}
      />
      <select name="status" value={filters.status || ''} onChange={handleChange}>
        <option value="">All statuses</option>
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="on-hold">On Hold</option>
        <option value="completed">Completed</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>
      <select name="priority" value={filters.priority || ''} onChange={handleChange}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}
