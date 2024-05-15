const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");

router.get("/allevents", eventController.getEvents);
router.get("/allevents/:id", eventController.getEventsbyId);

module.exports = router;
