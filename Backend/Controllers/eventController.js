const db = require("../models");
const { Op } = require("sequelize");
const Event = db.events;
const City = db.City;
const Session = db.session;
const Category = db.event_category;
const moment = require("moment");
const Ticket = db.ticket;

const getEvents = async (req, res) => {
  try {
    const { id, event_name, category_id, search, event_category, limit, offset } = req.query;

    // Define the common query options
    const queryOptions = {
      include: [
        {
          model: City,
          as: "city",
          attributes: ["name"], // Only include the city name
        },
      ],
    };

    // Adjust query options based on the query parameters
    if (id) {
      queryOptions.where = { id };
      const result = await Event.findOne(queryOptions);
      return res.status(200).send(result);
    } else if (event_name) {
      queryOptions.where = { event_name };
      const result = await Event.findOne(queryOptions);
      return res.status(200).send(result);
    } else if (category_id) {
      queryOptions.where = { category_id };
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);   // Apply limit if provided and valid
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10); // Apply offset if provided and valid
      }
      const results = await Event.findAll(queryOptions);
      return res.status(200).send(results);
    } else if (event_category) {
      queryOptions.include.push({
        model: Category,
        as: "category",
        where: { name: event_category },
      });
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);   // Apply limit if provided and valid
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10); // Apply offset if provided and valid
      }
      const results = await Event.findAll(queryOptions);
      return res.status(200).send(results);
    } else if (search) {
      queryOptions.where = {
        [Op.or]: [
          { event_name: { [Op.like]: `%${search}%` } },
          { event_description: { [Op.like]: `%${search}%` } },
        ],
      };
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);   // Apply limit if provided and valid
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10); // Apply offset if provided and valid
      }
      const results = await Event.findAll(queryOptions);
      return res.status(200).send(results);
    } else {
      // Fetch all events if no specific query parameters are provided
      // Default limit and offset to undefined if not provided
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }
      const results = await Event.findAll(queryOptions);
      return res.status(200).send(results);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
        model: Session,
        as: "session",
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
      include: {
        model: Session,
        as: 'session', // Specify the alias here
        required: true, // Ensures only Events with Sessions are included
        include: {
          model: Ticket,
          as: 'ticket', // Specify the alias here
          where: {
            ticket_date: {
              [Op.eq]: formattedDate,
            },
          },
          required: true, // Ensures only Sessions with Tickets are included
        },
      },
    });

    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching events" });
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
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
