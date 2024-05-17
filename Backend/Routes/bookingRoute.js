const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");

router.post("/booking/insert", bookingController.createBooking);
router.get("/booking", bookingController.getBooking);
module.exports = router;
