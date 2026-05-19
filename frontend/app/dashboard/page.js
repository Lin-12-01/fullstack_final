'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import OnlineUsers from '../../components/OnlineUsers';
import NotificationsPanel from '../../components/NotificationsPanel';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import styles from '../../styles/components.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, t, taskList] = await Promise.all([
          api.getProjects(),
          api.getTeams(),
          api.searchTasks({}),
        ]);
        setProjects(p);
        setTeams(t);
        setTasks(taskList);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const doneTasks = tasks.filter((t) => t.status === 'done').length;

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <div className="dashboardGrid">
          <section>
            <div className={styles.grid}>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Projects</h3>
                <p className={styles.cardMeta}>{projects.length} total</p>
              </article>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Teams</h3>
                <p className={styles.cardMeta}>{teams.length} total</p>
              </article>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Tasks</h3>
                <p className={styles.cardMeta}>
                  {tasks.length} total · {doneTasks} completed
                </p>
              </article>
            </div>
          </section>
          <OnlineUsers />
          <NotificationsPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}
