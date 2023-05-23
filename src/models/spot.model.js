// Spot Model
const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  parking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  is_ev: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'out_of_order'],
    default: 'available'
  },
  max_hour: {
    type: Number,
  },
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservations'
  }],
});


const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
  