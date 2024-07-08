const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");

router.post("/event/insert", eventController.createEvent);
router.get("/allevents", eventController.getEvents);
router.get("/allevents/lateNight", eventController.getNightEvents);
router.get("/allevents/todayEvent", eventController.getTodayEvent);
router.get("/allevents/newEvent", eventController.newEvent);
router.get("/allevents/weeklyEvent", eventController.EventsthisWeek);
router.get("/allevents/:id", eventController.getEventsbyId);
router.delete("/delete/:id", eventController.deleteEvent);
router.get("/events-by-tag", eventController.getEventsByTags);


module.exports = router;
