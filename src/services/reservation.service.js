const Reservation = require("../models/reservation.model");
const Spot = require('../models/spot.model');
const User = require('../models/user.model');

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {

        const { user_id , spot_id , price , checkin , checkout , status } = req.body ;
        const user = User.findById(user_id);
        console.log("🚀 ~ file: reservation.service.js:11 ~ exports.createReservation= ~ user:", user)
        const spot = Spot.findById(spot_id);

        if( !user._id ) {
            return res.status(404).send({message: 'User not found.'});
        }

        if( !spot_id ) {
            return res.status(404).send({message: 'Spot not found.'});
        }

        const reservation = new Reservation(req.body);
        await reservation.save();
        

        user.reservations.push(reservation._id);
        await user.save();

        spot.reservations.push(reservation._id);
        await spot.save();

        res.status(201).send(reservations);

    } catch (error) {
        console.log("🚀 ~ file: reservation.service.js:34 ~ exports.createReservation= ~ error:", error)
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
