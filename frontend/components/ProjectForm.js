'use client';

import { useState } from 'react';
import styles from '../styles/components.module.css';

const initial = {
  title: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  tags: '',
};

export default function ProjectForm({ onSubmit, submitLabel = 'Create Project' }) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
    });
    setForm(initial);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="tags">Tags (comma separated)</label>
        <input id="tags" name="tags" value={form.tags} onChange={handleChange} />
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        {submitLabel}
      </button>
    </form>
  );
}
