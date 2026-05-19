'use client';

import { useState } from 'react';
import styles from '../styles/components.module.css';

export default function TaskForm({ onSubmit, members = [] }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      assignedTo: form.assignedTo || undefined,
      dueDate: form.dueDate || undefined,
    });
    setForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="task-title">Title</label>
        <input id="task-title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="task-desc">Description</label>
        <textarea id="task-desc" name="description" value={form.description} onChange={handleChange} rows={2} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="task-status">Status</label>
        <select id="task-status" name="status" value={form.status} onChange={handleChange}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="task-priority">Priority</label>
        <select id="task-priority" name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="task-due">Due Date</label>
        <input id="task-due" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
      </div>
      {members.length > 0 && (
        <div className={styles.formGroup}>
          <label htmlFor="task-assign">Assign To</label>
          <select id="task-assign" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Add Task
      </button>
    </form>
  );
}
