const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  title: {
    type: String,
    required: [true, 'Map title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['mindmap', 'flowchart', 'roadmap'],
    default: 'mindmap'
  },
  nodes: {
    type: Array,
    default: []
  },
  edges: {
    type: Array,
    default: []
  },
  cardColor: {
    type: String,
    default: '#22D3EE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Map', mapSchema);
