const db = require("../models");
const Event = db.events;
const City = db.city;

const getEvents = async (req, res) => {
  try {
    const eventId = req.query.id;
    const EventName = req.query.event_name;
    const cityName = req.query.name;
    const region = req.query.region_id;
    const category = req.query.category_id;

    let results;
    if (eventId) {
      results = await Event.findOne({ where: { id: eventId } });
    }
    if (EventName) {
      results = await Event.findOne({ where: { event_name: EventName } });
    }
    if (cityName) {
      results = await Event.findAll({
        include: [
          {
            model: City,
            as: "city",
            where: { name: cityName },
          },
        ],
      });
    }
    if (region) {
      results = await Event.findOne({ where: { region_id: region } });
    }
    if (category) {
      results = await Event.findOne({ where: { category_id: category } });
    }
    res.status(200).send(results);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEventsbyId = async (req, res) => {
  let id = req.params.id;
  let event = await Event.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).send(event);
};

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({ newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during insertion" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);
    console.log(event);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    await Event.destroy({
      where: {
        id: eventId,
      },
    });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getEvents, getEventsbyId, deleteEvent, createEvent };
