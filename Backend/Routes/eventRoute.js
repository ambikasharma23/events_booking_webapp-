const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");

router.post("/event/insert", eventController.createEvent);
router.get("/allevents", eventController.getEvents);
router.get("/allevents/weaklyEvent", eventController.EventsthisWeak);
router.get("/allevents/:id", eventController.getEventsbyId);
router.delete("/delete/:id", eventController.deleteEvent);

module.exports = router;
