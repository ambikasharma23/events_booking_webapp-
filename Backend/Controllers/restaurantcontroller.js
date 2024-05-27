const { Op } = require('sequelize');
const { restaurant, events } = require('../models'); // Ensure the correct import statement

// Haversine function to calculate distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const p = Math.PI / 180;
  const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

const getNearbyEvents = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const restaurants = await restaurant.findAll({
      include: {
        model: events, // Use the correct alias here
        as: 'events', // Specify the alias
        required: true
      }
    });

    const nearbyEvents = restaurants
      .filter(restaurant => {
        const distance = haversineDistance(lat, lon, restaurant.latitude, restaurant.longitude);
        return distance <= 10000; // Adjust distance (in kilometers) as needed
      })
      .map(restaurant => restaurant.events)
      .flat();

    res.json(nearbyEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
};

module.exports = { getNearbyEvents };
