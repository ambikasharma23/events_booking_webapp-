const express = require('express');
const { getNearbyEvents ,updateLocation} = require('../Controllers/restaurantcontroller');
const router = express.Router();

router.get('/under10km',getNearbyEvents);
router.post('/updateLocation',updateLocation);

module.exports = router;
