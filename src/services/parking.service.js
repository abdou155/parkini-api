const Parking = require('../models/parking.model');

// Create a new parking
exports.createParking = async (req, res) => {
  try {
    console.log("🚀 ~ file: parking.service.js:7 ~ exports.createParking= ~ req.body:", req.body)

    const parking = new Parking(req.body);
    console.log("🚀 ~ file: parking.service.js:7 ~ exports.createParking= ~ parking:", parking)
    await parking.save();
    res.status(201).send(parking);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all parkings
exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find().populate('spots');
    res.send(parkings);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a parking by id
exports.getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate('spots');
    if (!parking) {
      return res.status(404).send();
    }
    res.send(parking);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a parking by id
exports.updateParkingById = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!parking) {
      return res.status(404).send();
    }
    res.send(parking);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a parking by id
exports.deleteParkingById = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    if (!parking) {
      return res.status(404).send();
    }
    res.send(parking);
  } catch (error) {
    res.status(500).send(error);
  }
};
