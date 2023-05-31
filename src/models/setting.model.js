// Setting Model
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({


  code: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: false
  },

});


const Setting = mongoose.model('Settings', settingSchema);

module.exports = Setting;
  