const express = require('express');
const router = express.Router();
const spotService = require('../services/spot.service');

// Get all spots
router.get('/', spotService.getAllSpots);

// Get a spot by id
router.get('/:id', spotService.getSpotById);

// Create a new spot
router.post('/', spotService.createSpot);

// Update a spot by id
router.put('/:id', spotService.updateSpotById);

// Delete a spot by id
router.delete('/:id', spotService.deleteSpotById);

module.exports = router;
