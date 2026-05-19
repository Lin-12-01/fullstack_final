const express = require('express');
const {
  getMyProfile,
  updateMyProfile,
  updateAvatar,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
