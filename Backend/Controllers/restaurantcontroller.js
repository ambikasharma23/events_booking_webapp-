const { Op } = require('sequelize');
const { restaurant, events } = require('../models');

// Haversine function to calculate distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = angle => angle * (Math.PI / 180.0);

  // Convert to radians
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Distance between latitudes and longitudes
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Apply formula
  const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.pow(Math.sin(dLon / 2), 2);
  const rad = 6371; // Radius of the Earth in kilometers
  const c = 2 * Math.asin(Math.sqrt(a));
  return rad * c;
}

const getNearbyEvents = async (req, res) => {
  const { lat, lon, maxDistance = 100 } = req.query;
  const { latitude: userLat, longitude: userLon } = req.body; // Fetch user's location from request body

  // Ensure we have latitude and longitude either from query or request body
  if ((!lat || !lon) && (!userLat || !userLon)) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const latitude = parseFloat(lat || userLat); // Use query latitude if present, otherwise use user's latitude
  const longitude = parseFloat(lon || userLon); // Use query longitude if present, otherwise use user's longitude
  const maxDist = parseFloat(maxDistance);

  try {
    const restaurants = await restaurant.findAll({
      include: {
        model: events,
        as: 'events',
        required: true
      }
    });

    const nearbyEvents = restaurants
      .filter(restaurant => {
        const distance = haversineDistance(latitude, longitude, restaurant.latitude, restaurant.longitude);
        console.log(`Distance to ${restaurant.restaurant_name}: ${distance} km`); // Log the distance
        return distance <= maxDist;
      })
      .map(restaurant => restaurant.events)
      .flat();

    res.json(nearbyEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
};
// controllers/locationController.js

const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // Process the latitude and longitude data as needed
    console.log(`Received location update: ${latitude}, ${longitude}`);
    // You can perform additional operations here (e.g., updating user's location in database)
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};




module.exports = { getNearbyEvents, updateLocation};
