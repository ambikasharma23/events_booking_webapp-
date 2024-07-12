const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");
const verifyToken = require('../middleware/authmiddleware');
router.post("/booking/insert",verifyToken, bookingController.createBooking);
router.get("/booking", bookingController.getBookings);
router.get("/booking/:custId", bookingController.getBookingByCustId);
router.get("/booking/id/:booking_id",bookingController.getBookingById);

module.exports = router;
