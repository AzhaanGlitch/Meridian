const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date }
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  parentGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'In Progress'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Personal', 'Work', 'Career', 'Health', 'Finance', 'Education', 'Projects'],
    default: 'Personal'
  },
  cardColor: {
    type: String,
    enum: ['#FBBF24', '#FB923C', '#C084FC', '#A3E635', '#86EFAC', '#22D3EE', '#FFFFFF'],
    default: '#FBBF24' // Warm Yellow default
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  tasks: [taskSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
