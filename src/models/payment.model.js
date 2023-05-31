// Spot Model
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  
  transactionId: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },
  
  date: {
    type: Date,
    default: true
  },
  
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservations',
    required: true
  },
});

const Payment = mongoose.model('Payments', paymentSchema);

module.exports = Payment;
  