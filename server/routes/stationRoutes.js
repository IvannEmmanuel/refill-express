// In your Express app (e.g., app.js or routes/station.js)
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Station = require("../Models/Station"); // Adjust the path as needed
const { getRoadPolyline } = require("../utils/mapUtils");

// In stationRoutes.js
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST request to register a new station
router.post("/register", async (req, res) => {
  const {
    stationName,
    latitude,
    longitude,
    address,
    contactNumber,
    price,
    description,
  } = req.body;

  // Basic validation for required fields
  if (
    !stationName ||
    latitude == null ||
    longitude == null ||
    !address ||
    !contactNumber ||
    !price
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new station instance
    const newStation = new Station({
      stationName,
      latitude,
      longitude,
      address,
      contactNumber,
      price,
      description,
    });

    // Save the station to the database
    const savedStation = await newStation.save();
    res
      .status(201)
      .json({ message: "Station registered successfully", data: savedStation });
  } catch (error) {
    console.error("Error registering station:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/route", async (req, res) => {
  try {
    // Assume origin and destination are passed as query parameters
    const origin = { lat: req.query.originLat, lng: req.query.originLng };
    const destination = { lat: req.query.destLat, lng: req.query.destLng };

    // Get the road-following polyline
    const polylinePoints = await getRoadPolyline(origin, destination);

    if (!polylinePoints) {
      return res.status(404).json({ message: "No route found" });
    }

    res.json({ polyline: polylinePoints });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting route", error: error.message });
  }
});

module.exports = router;
