const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    avatarUrl: { type: String, default: '' },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
