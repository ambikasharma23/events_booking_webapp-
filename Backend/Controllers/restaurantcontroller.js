const { Op } = require('sequelize');
const { restaurant, events } = require('../models');

let userLocation = { latitude: null, longitude: null };

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
  const { latitude, longitude } = userLocation;
  console.log(`Current stored location: ${latitude}, ${longitude}`);
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'User location not available' });
  }

  const maxDistance = req.query.maxDistance || 10; // Set default to 10 km

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
        console.log(`Distance to ${restaurant.restaurant_name}: ${distance} km`); 
        return distance <= maxDistance;
      })
      .map(restaurant => restaurant.events)
      .flat();

    res.json(nearbyEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
};

const updateLocation = (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude && longitude) {
    userLocation = { latitude, longitude };
    console.log(`Received location update: ${latitude}, ${longitude}`);
    // Call getNearbyEvents() here to fetch nearby events based on the updated location
    getNearbyEvents(req, res);
    // Respond with a success message if needed
    // res.status(200).json({ message: 'Location updated successfully' });
  } else {
    res.status(400).json({ error: 'Invalid location data' });
  }
};

const getUserLocation = () => {
  console.log(`Returning stored location: ${userLocation.latitude}, ${userLocation.longitude}`);
  return userLocation;
};

module.exports = { getNearbyEvents, updateLocation, getUserLocation };
