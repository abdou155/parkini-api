const Spot = require("../models/spot.model");
const Parking = require('../models/parking.model');

// Create a new spot
exports.createSpot = async (req, res) => {
    try {
        const parking = await Parking.findById(req.body.parking_id);
        if (!parking) {
            return res.status(404).send({message: 'Parking not found.'});
        }
        const spot = new Spot({
            ...req.body,
            parking: parking._id,
        });
        await spot.save();
        parking.spots.push(spot._id);
        await parking.save();
        res.status(201).send(spot);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all spots
exports.getAllSpots = async (req, res) => {
    try {
        const spots = await Spot.find()
        res.send(spots);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a spot by id
exports.getSpotById = async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.id).populate('parking', 'name');
        if (!spot) {
            return res.status(404).send({message: 'Spot not found.'});
        }
        res.send(spot);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a spot by id
exports.updateSpotById = async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.id);
        if (!spot) {
            return res.status(404).send({message: 'Spot not found.'});
        }
        const parking = await Parking.findById(req.body.parking_id);
        if (!parking) {
            return res.status(404).send({message: 'Parking not found.'});
        }
        spot.set({
            ...req.body,
            parking: parking._id,
        });
        await spot.save();
        await parking.save();
        res.send(spot);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a spot by id
exports.deleteSpotById = async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.id);
        if (!spot) {
            return res.status(404).send({message: 'Spot not found.'});
        }
        const parking = await Parking.findById(spot.parking);
        parking.spots.pull(spot._id);
        await spot.remove();
        await parking.save();
        res.send(spot);
    } catch (error) {
        res.status(500).send(error);
    }
};
