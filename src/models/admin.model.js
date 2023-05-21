const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

const Admin = mongoose.model('Admins', adminSchema);

module.exports = Admin;

// admin.find({"email" : "nourjanenne3"}).sort().limit(10)
// admin.findByid(id)
// admin.save()
// admin.update()
// admin.findByIdAndDelete(id)