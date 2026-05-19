const User = require('../models/User');

const getMyProfile = async (req, res) => {
  res.json(req.user);
};

const updateMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.bio !== undefined) user.bio = req.body.bio;

  await user.save();
  const obj = user.toJSON();
  res.json(obj);
};

const updateAvatar = async (req, res) => {
  const { avatarUrl } = req.body;
  if (!avatarUrl) {
    return res.status(400).json({ message: 'avatarUrl is required' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true }
  ).select('-passwordHash');

  res.json(user);
};

module.exports = { getMyProfile, updateMyProfile, updateAvatar };
