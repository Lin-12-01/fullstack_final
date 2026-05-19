const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/search', searchTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

const projectTaskRouter = express.Router({ mergeParams: true });
projectTaskRouter.post('/', createTask);
projectTaskRouter.get('/', getProjectTasks);

module.exports = { taskRouter: router, projectTaskRouter };
