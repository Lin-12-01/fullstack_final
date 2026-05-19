'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProjectCard from '../../components/ProjectCard';
import ProjectForm from '../../components/ProjectForm';
import SearchFilterBar from '../../components/SearchFilterBar';
import UploadButtonComponent from '../../components/UploadButtonComponent';
import { api } from '../../lib/api';
import styles from '../../styles/components.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ query: '', status: '', priority: '' });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [error, setError] = useState('');

  const loadProjects = async (searchFilters = filters) => {
    try {
      const hasFilter = searchFilters.query || searchFilters.status || searchFilters.priority;
      const data = hasFilter
        ? await api.searchProjects(searchFilters)
        : await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (data) => {
    await api.createProject(data);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.deleteProject(id);
    loadProjects();
  };

  const handleCoverUpload = async (url) => {
    if (!selectedProjectId) return;
    await api.updateProject(selectedProjectId, { coverImageUrl: url });
    setSelectedProjectId(null);
    loadProjects();
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Projects</h1>
          <p>Manage your team projects</p>
        </div>
        <SearchFilterBar filters={filters} onChange={setFilters} onSearch={() => loadProjects(filters)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <section>
            <h2>Create Project</h2>
            <ProjectForm onSubmit={handleCreate} />
          </section>
          <section>
            <h2>Upload Cover (select project first)</h2>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
            >
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
            {selectedProjectId && (
              <UploadButtonComponent
                endpoint="projectCoverUploader"
                label="Upload Cover"
                onUploadComplete={handleCoverUpload}
              />
            )}
          </section>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.grid} style={{ marginTop: '2rem' }}>
          {projects.length === 0 ? (
            <p className={styles.empty}>No projects found</p>
          ) : (
            projects.map((p) => (
              <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
