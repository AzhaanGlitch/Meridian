const Workspace = require('../models/Workspace');

// @desc    Get all workspaces for user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json({ success: true, count: workspaces.length, data: workspaces });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    const workspace = await Workspace.create({
      user: req.user._id,
      name,
      description,
      icon: icon || 'Folder',
      color: color || '#FBBF24'
    });

    res.status(201).json({ success: true, data: workspace });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
const updateWorkspace = async (req, res) => {
  try {
    let workspace = await Workspace.findOne({ _id: req.params.id, user: req.user._id });
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: workspace });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ _id: req.params.id, user: req.user._id });
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    if (workspace.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete default workspace' });
    }

    await workspace.deleteOne();
    res.json({ success: true, message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
};
