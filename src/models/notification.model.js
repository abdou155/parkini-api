const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  
  notif_at: {
    type: Date,
    required: true,
  }, 

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false
  }
});

const Notification = mongoose.model('Notifications', notificationSchema);

module.exports = Notification;