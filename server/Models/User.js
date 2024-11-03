const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date, // Use Date type for birthdate
    required: true,
  },
  gender: {
    type: String, // You can use String or Enum for specific options
    enum: ['Male', 'Female', 'Other'], // Optional: restrict values
    required: true,
  },
  profilePicture: {
    type: String, // You can store the URL of the profile picture
    required: false, // Set to true if the picture is mandatory
  },
  deliveryFee: {
    type: Number, // To store delivery fee
    required: false, // Set to true if mandatory
  },
  transactionFee: {
    type: Number, // To store transaction fee
    required: false, // Set to true if mandatory
  },
  totalCost: {
    type: Number, // To store total cost of the order
    required: false, // Set to true if mandatory
  },
  gallonsCost: {
    type: Number, // To store the cost of gallons ordered
    required: false, // Set to true if mandatory
  },
  status: {
    type: String, // To store the status of the order
    required: false, // Set to true if mandatory
  },
});

module.exports = mongoose.model('User', userSchema);
