const db = require("../models");
const { Op } = require("sequelize");
const Event = db.events;
const EventException = db.event_exception;
const City = db.cities;
const moment = require("moment");

const filterEvents = (events, eventExceptions) => {
  const currentDate = new Date();
  const formatDate = moment(currentDate).format("YYYY-MM-DD");
  const currentDay = currentDate.getDay();
  console.log(currentDay);

  return events.filter((event) => {
    const isException = eventExceptions.some((exception) => {
      const startDate = exception.start_date
        ? new Date(exception.start_date)
        : null;
      const endDate = exception.end_date ? new Date(exception.end_date) : null;
      const formatStart = startDate
        ? moment(startDate).format("YYYY-MM-DD")
        : null;
      const formatEnd = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

      return (
        exception.event_id === event.id &&
        ((!startDate &&
          !endDate &&
          exception.day &&
          currentDay === exception.day) ||
          !startDate ||
          formatStart <= formatDate ||
          !endDate ||
          formatEnd >= formatDate ||
          ((!exception.day || currentDay === exception.day) &&
            (!exception.session_id ||
              exception.session_id === event.session_id)))
      );
    });

    return !isException && moment(event.end_date).isSameOrAfter(formatDate);
  });
};

const getEvents = async (req, res) => {
  try {
    const [events, eventExceptions] = await Promise.all([
      Event.findAll(),
      EventException.findAll(),
    ]);
    const visibleEvents = filterEvents(events, eventExceptions);
    const {
      id: eventId,
      event_name: eventName,
      name: cityName,
      region_id: region,
      category_id: category,
      search: searchQuery,
    } = req.query;

    let results;
    if (eventId) {
      results = visibleEvents.find((event) => event.id == eventId);
    } else if (eventName) {
      results = visibleEvents.find((event) => event.event_name === eventName);
    } else if (cityName) {
      results = visibleEvents.filter((event) => event.city.name === cityName);
    } else if (region) {
      results = visibleEvents.filter((event) => event.region_id == region);
    } else if (category) {
      results = visibleEvents.filter((event) => event.category_id == category);
    } else if (searchQuery) {
      results = visibleEvents.filter(
        (event) =>
          event.event_name.includes(searchQuery) ||
          event.event_description.includes(searchQuery)
      );
    } else {
      results = visibleEvents;
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
