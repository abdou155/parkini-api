// Parking Model
const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  spots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spot'
  }],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
