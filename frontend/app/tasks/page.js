'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import TaskCard from '../../components/TaskCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import { api } from '../../lib/api';
import styles from '../../styles/components.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ query: '', status: '', priority: '' });
  const [error, setError] = useState('');

  const loadTasks = async (searchFilters = filters) => {
    try {
      const data = await api.searchTasks(searchFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Tasks</h1>
          <p>Search and filter all your tasks</p>
        </div>
        <SearchFilterBar filters={filters} onChange={setFilters} onSearch={() => loadTasks(filters)} />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.grid}>
          {tasks.length === 0 ? (
            <p className={styles.empty}>No tasks found</p>
          ) : (
            tasks.map((t) => <TaskCard key={t._id} task={t} />)
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
