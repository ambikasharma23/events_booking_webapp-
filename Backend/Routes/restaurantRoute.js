const express = require('express');
const { getNearbyEvents ,updateLocation} = require('../Controllers/restaurantcontroller');

const router = express.Router();

router.get('/restaurants',getNearbyEvents);
router.post('/updateLocation',updateLocation);

module.exports = router;
