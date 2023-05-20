const express = require('express');
const router = express.Router();
const parkingService = require('../services/parking.service');

// Get all parkings
router.get('/', parkingService.getAllParkings);

// Get a parking by id
router.get('/:id', parkingService.getParkingById);

// Create a new parking
router.post('/', parkingService.createParking);

// Update a parking by id
router.put('/:id', parkingService.updateParkingById);

// Delete a parking by id
router.delete('/:id', parkingService.deleteParkingById);

module.exports = router;
