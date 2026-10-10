const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const { category, status, priority, workspace } = req.query;
    let query = { user: req.user._id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (workspace) query.workspace = workspace;

    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Get sub-goals
    const subGoals = await Goal.find({ parentGoal: goal._id, user: req.user._id });

    res.json({ success: true, data: { ...goal.toObject(), subGoals } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      cardColor,
      dueDate,
      startDate,
      parentGoal,
      workspace,
      tags,
      tasks
    } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      status: status || 'In Progress',
      priority: priority || 'Medium',
      category: category || 'Personal',
      cardColor: cardColor || '#FBBF24',
      dueDate,
      startDate,
      parentGoal: parentGoal || null,
      workspace,
      tags: tags || [],
      tasks: tasks || []
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Calculate progress automatically if tasks changed
    if (req.body.tasks && Array.isArray(req.body.tasks)) {
      const total = req.body.tasks.length;
      if (total > 0) {
        const completed = req.body.tasks.filter(t => t.completed).length;
        req.body.progress = Math.round((completed / total) * 100);
      }
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    await goal.deleteOne();
    // Also clear parentGoal ref on any subgoals
    await Goal.updateMany({ parentGoal: req.params.id }, { parentGoal: null });

    res.json({ success: true, message: 'Goal removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal
};
