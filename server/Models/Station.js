const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  price: {type: Number, required: true},
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

module.exports = mongoose.model('Station', stationSchema);