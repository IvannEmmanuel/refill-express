const axios = require("axios");
require("dotenv").config();

// Function to get a polyline that follows the road between two points
async function getRoadPolyline(origin, destination) {
  try {
    const apiKey = process.env.GOOGLEMAP_API_KEY; // Store your API key in an environment variable
    const response = await axios.get("https://maps.gomaps.pro/maps/api/directions/json", {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: apiKey
      }
    });

    const { routes } = response.data;
    if (routes.length === 0) {
      throw new Error("No route found");
    }

    // Extract the polyline points
    const polylinePoints = routes[0].overview_polyline.points;
    return polylinePoints; // Return the polyline to be used on the front end
  } catch (error) {
    console.error("Error fetching directions:", error);
    return null;
  }
}

module.exports = { getRoadPolyline };
