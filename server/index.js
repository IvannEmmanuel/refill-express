const express = require('express');
const mongoose = require('mongoose');
const User = require('./Models/User'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors');
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Replace with your MongoDB connection string
const dbURI = 'mongodb+srv://human:indra123@cluster0.5jmta.mongodb.net/refillStationDB?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Database connection error:', err));

// Basic Route to Test Server
app.get('/', (req, res) => {
  res.send('Server is running!');
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

    // Update user document with order details
    user.deliveryFee = deliveryFee;
    user.transactionFee = transactionFee;
    user.totalCost = totalCost;
    user.gallonsCost = gallonsCost;
    user.status = status || "Processing"; // Add default status

    // Save the updated user document
    await user.save();

    // Respond with the updated user details
    res.status(200).json({
      deliveryFee: user.deliveryFee,
      transactionFee: user.transactionFee,
      totalCost: user.totalCost,
      gallonsCost: user.gallonsCost,
      status: user.status,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
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

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      // User not found
      return res.status(400).json({ error: 'User not found. Wrong email or password.' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong password. Please try again.' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', userId: user._id }); // You can send back more user info if needed
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});



// Route to create a new order
app.post('/api/orders', async (req, res) => {
  const { deliveryFee, transactionFee, totalCost, gallonsCost } = req.body;

  // Basic validation for required fields
  if (deliveryFee == null || transactionFee == null || totalCost == null || gallonsCost == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new Order instance
    const newOrder = new Order({  // Change here
      deliveryFee,
      transactionFee,
      totalCost,
      gallonsCost,
    });

    // Save the new order to the database
    await newOrder.save();

    // Respond with the created order details
    res.status(201).json({
      deliveryFee: newOrder.deliveryFee,
      transactionFee: newOrder.transactionFee,
      totalCost: newOrder.totalCost,
      gallonsCost: newOrder.gallonsCost,
      status: newOrder.status,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
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
      password: hashedPassword, // Store the hashed password
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
