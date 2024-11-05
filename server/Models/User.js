const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  deliveryFee: Number,
  transactionFee: Number,
  totalCost: Number,
  gallonsCost: Number,
  status: {
    type: String,
    default: "Processing",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  birthdate: Date,
  gender: String,
  profilePicture: String,
  phoneNumber: String,
  orders: [orderSchema],
  stations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Station" }],
});

module.exports = mongoose.model("User", userSchema);
