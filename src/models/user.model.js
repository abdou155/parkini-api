// Spot Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  phone: {
    type : String,
    required: true,
    unique: true
  },
  
  otp: {
    type : String,
    required: false
  },

  email: {
    type : String,
    required: false
  },

  type: {
    type : String,
    required: false
  },

  first_name: {
    type : String,
    required: false
  },

  last_name: {
    type : String,
    required: false
  },

  car_mat: {
    type : String,
    required: false
  },

});

const User = mongoose.model('Users', userSchema);

module.exports = User;
