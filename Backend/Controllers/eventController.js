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
module.exports = { getEvents, getEventsbyId };
