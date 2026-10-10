const Map = require('../models/Map');

// @desc    Get all maps for user
// @route   GET /api/maps
// @access  Private
const getMaps = async (req, res) => {
  try {
    const maps = await Map.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: maps.length, data: maps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single map
// @route   GET /api/maps/:id
// @access  Private
const getMapById = async (req, res) => {
  try {
    const map = await Map.findOne({ _id: req.params.id, user: req.user._id });
    if (!map) {
      return res.status(404).json({ success: false, message: 'Map not found' });
    }
    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create map
// @route   POST /api/maps
// @access  Private
const createMap = async (req, res) => {
  try {
    const { title, description, type, nodes, edges, cardColor, workspace } = req.body;

    const map = await Map.create({
      user: req.user._id,
      title,
      description,
      type: type || 'mindmap',
      nodes: nodes || [],
      edges: edges || [],
      cardColor: cardColor || '#22D3EE',
      workspace
    });

    res.status(201).json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update map
// @route   PUT /api/maps/:id
// @access  Private
const updateMap = async (req, res) => {
  try {
    let map = await Map.findOne({ _id: req.params.id, user: req.user._id });
    if (!map) {
      return res.status(404).json({ success: false, message: 'Map not found' });
    }

    map = await Map.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete map
// @route   DELETE /api/maps/:id
// @access  Private
const deleteMap = async (req, res) => {
  try {
    const map = await Map.findOne({ _id: req.params.id, user: req.user._id });
    if (!map) {
      return res.status(404).json({ success: false, message: 'Map not found' });
    }

    await map.deleteOne();
    res.json({ success: true, message: 'Map deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMaps,
  getMapById,
  createMap,
  updateMap,
  deleteMap
};
