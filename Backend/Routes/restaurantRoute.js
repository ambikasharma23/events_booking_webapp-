// routes/restaurant.js

const express = require('express');
const { getNearbyEvents, updateLocation, getNearbyEventsSortedByDistance } = require('../Controllers/restaurantcontroller');
const router = express.Router();

router.get('/under10km', getNearbyEvents);
router.post('/updateLocation', updateLocation);

// New route to get events sorted by distance
router.get('/events/sortedByDistance', getNearbyEventsSortedByDistance);

module.exports = router;
