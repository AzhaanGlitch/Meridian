const express = require('express');
const router = express.Router();
const { getMaps, getMapById, createMap, updateMap, deleteMap } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMaps)
  .post(protect, createMap);

router.route('/:id')
  .get(protect, getMapById)
  .put(protect, updateMap)
  .delete(protect, deleteMap);

module.exports = router;
