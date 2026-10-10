const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Workspace name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Folder'
  },
  color: {
    type: String,
    default: '#FBBF24' // default warm yellow pastel
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workspace', workspaceSchema);
