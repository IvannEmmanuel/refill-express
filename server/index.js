const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('./Models/User'); // Import the User model
const stationRoutes = require('./routes/stationRoutes');
const app = express();
require('dotenv').config()

// Middleware
app.use(express.json());
app.use(cors());
const upload = multer({ dest: 'uploads/' }); // Temporary folder for file uploads

// MongoDB connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Database connection error:', err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/stations', stationRoutes);

// File upload route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed', details: err });
  }
});

// Route to create a new user
app.post('/api/users', async (req, res) => {
  const { firstname, lastname, email, password, address, birthdate, gender, profilePicture, phoneNumber } = req.body;

  // Basic validation for required fields
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      address,
      birthdate,
      phoneNumber,
      gender,
      profilePicture,
    });

    // Save the new user to the database
    await newUser.save();
    
    // Respond with the created user (excluding the password)
    res.status(201).json({
      id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      address: newUser.address,
      phoneNumber: newUser.phoneNumber,
      birthdate: newUser.birthdate,
      gender: newUser.gender,
      profilePicture: newUser.profilePicture,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found. Wrong email or password.' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong password. Please try again.' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Route to get a single user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Send user data without password
    const userProfile = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      birthdate: user.birthdate,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
    };
    res.status(200).json(userProfile);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    
    // Respond with the list of users
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.get('/api/orders', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming orders are stored in the user document
    const orders = user.orders || [];
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new order
app.post('/api/orders', async (req, res) => {
  const { deliveryFee, transactionFee, totalCost, gallonsCost, email, status } = req.body;

  // Basic validation for required fields
  if (!email || deliveryFee == null || transactionFee == null || totalCost == null || gallonsCost == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new order
    const newOrder = {
      deliveryFee,
      transactionFee,
      totalCost,
      gallonsCost,
      status: status || "Processing",
      date: new Date()
    };

    // Add the new order to the user's orders array
    user.orders.push(newOrder);

    // Save the updated user document
    await user.save();

    // Respond with the newly created order
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a specific order
app.delete('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await User.updateOne(
      { 'orders._id': orderId },
      { $pull: { orders: { _id: orderId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
