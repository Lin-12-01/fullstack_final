'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TaskCard from '../../../components/TaskCard';
import TaskForm from '../../../components/TaskForm';
import UploadButtonComponent from '../../../components/UploadButtonComponent';
import { useWebSocket } from '../../../context/WebSocketContext';
import { api } from '../../../lib/api';
import styles from '../../../styles/components.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { taskUpdates } = useWebSocket();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([api.getProject(id), api.getProjectTasks(id)]);
      setProject(p);
      setTasks(t);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  useEffect(() => {
    const latest = taskUpdates.find((u) => u.projectId === id);
    if (latest) loadData();
  }, [taskUpdates, id, loadData]);

  const handleCreateTask = async (data) => {
    await api.createTask(id, data);
    loadData();
  };

  const handleStatusChange = async (taskId, status) => {
    await api.updateTask(taskId, { status });
    loadData();
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete task?')) return;
    await api.deleteTask(taskId);
    loadData();
  };

  const handleAttachmentUpload = async (url) => {
    if (!selectedTaskId) return;
    await api.updateTask(selectedTaskId, { attachmentUrl: url });
    setSelectedTaskId(null);
    loadData();
  };

  if (!project && !error) {
    return (
      <ProtectedRoute>
        <div className="container">Loading...</div>
      </ProtectedRoute>
    );
  }

  const members = project?.members || [];

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>{project?.title}</h1>
          <p>{project?.description}</p>
          <span className={`${styles.badge} ${styles.badgeMedium}`}>{project?.status}</span>
        </div>
        {project?.coverImageUrl && (
          <img src={project.coverImageUrl} alt="" className={styles.coverImage} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <section>
            <h2>Add Task</h2>
            <TaskForm onSubmit={handleCreateTask} members={members} />
            <h3 style={{ marginTop: '2rem' }}>Task Attachment</h3>
            <select
              value={selectedTaskId || ''}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            >
              <option value="">Select task...</option>
              {tasks.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            {selectedTaskId && (
              <UploadButtonComponent
                endpoint="taskAttachmentUploader"
                label="Upload Attachment"
                onUploadComplete={handleAttachmentUpload}
              />
            )}
          </section>
          <section>
            <h2>Tasks ({tasks.length})</h2>
            <div className={styles.grid}>
              {tasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
