const db = require("../models");
const { Op } = require("sequelize");
const sessions = require("../models/sessions");
const moment = require("moment");
const Event = db.events;
const City = db.city;

const getEvents = async (req, res) => {
  try {
    const eventId = req.query.id;
    const EventName = req.query.event_name;
    const cityName = req.query.name;
    const region = req.query.region_id;
    const category = req.query.category_id;
    const searchQuery=req.query.search;

    let results;
    if (eventId) {
      results = await Event.findOne({ where: { id: eventId } });
    }
    else if (EventName) {
      results = await Event.findOne({ where: { event_name: EventName } });
    }
    else if (cityName) {
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
    else if (region) {
      results = await Event.findOne({ where: { region_id: region } });
    }
    else if (category) {
      results = await Event.findOne({ where: { category_id: category } });
    } else {
      results = await Event.findAll();
    }
    else if(searchQuery){
      results=await Event.findAll({
        where: {
          [Op.or]:[
            {event_name:{[Op.like]:`%${searchQuery}%`}},
            {event_description:{[Op.like]:`%${searchQuery}%`}},
          ],
        },
      });
    }else{
      results=await Event.findAll();
    }
    res.status(200).send(results);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const EventsthisWeak = async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today.setDate(diff + 6));
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyEvents = await Event.findAll({
      where: {
        start_date: {
          [Op.between]: [new Date(), endOfWeek],
        },
      },
    });

    res.status(200).json(weeklyEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNightEvents = async (req, res) => {
  try {
    const lateTime = "19:00:00";
    const results = await Event.findAll({
      include: {
        model: sessions,
        where: {
          start_time: {
            [Op.gt]: lateTime,
          },
        },
      },
    });
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching sessions" });
  }
};

const getTodayEvent = async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = moment(today).format("YYYY-MM-DD");
    const results = await Event.findAll({
      where: {
        start_date: formattedDate,
      },
    });
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching sessions" });
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
const newEvent = async (req, res) => {
  try {
    const today = new Date();
    const newEvent = today.setDate(today.getDate() - 2);
    const formattedDate = moment(newEvent).format("YYYY-MM-DD");

    console.log("newEvent: ", formattedDate);
    const result = await Event.findAll({
      where: {
        createdAt: {
          [Op.gt]: formattedDate,
        },
      },
    });
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching sessions" });
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

module.exports = {
  getEvents,
  getEventsbyId,
  deleteEvent,
  createEvent,
  EventsthisWeak,
  getNightEvents,
  getTodayEvent,
  newEvent,
};
