const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { taskRouter, projectTaskRouter } = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Team PM Backend API is running',
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Team PM API is running',
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/projects/:projectId/tasks', projectTaskRouter);
  app.use('/api/tasks', taskRouter);
  app.use('/api/teams', teamRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
