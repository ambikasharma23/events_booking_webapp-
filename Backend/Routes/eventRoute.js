const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");

router.post("/insert", eventController.createEvent);
router.get("/allevents", eventController.getEvents);
router.get("/allevents/:id", eventController.getEventsbyId);
router.delete("/delete/:id", eventController.deleteEvent);

module.exports = router;
