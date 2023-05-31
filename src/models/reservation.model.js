// Spot Model
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },

  spot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spot',
    required: true
  },

  price: {
    type: Number,
    required: true
  },
  checkin: {
    type: Date,
    default: false
  },

  checkout: {
    type: Date,
    default: false
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled'],
    default: 'pending'
  },
   
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payments',
    required: false
  },
});

const Reservation = mongoose.model('Reservations', reservationSchema);

module.exports = Reservation;
  