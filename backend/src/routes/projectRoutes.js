const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/search', searchProjects);
router.route('/').get(getProjects).post(createProject);
router
  .route('/:id')
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
