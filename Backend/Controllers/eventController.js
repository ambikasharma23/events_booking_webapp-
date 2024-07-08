const db = require("../models");
const { Op } = require("sequelize");
const Event = db.events;
const City = db.City;
const Session = db.session;
const Category = db.event_category;
const moment = require("moment");
const Ticket = db.ticket;
const redis = require("../utils/redis");
const { getUserLocation } = require('./restaurantcontroller');

const getEvents = async (req, res) => {
  try {
    const {
      id,
      event_name,
      category_id,
      search,
      event_category,
      limit,
      offset,
    } = req.query;
    const cacheKey = `events_${
      id || event_name || category_id || event_category || search || "all"
    } ${limit || "default"} ${offset || "default"}`;

    // Try to get cached data
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).send(parsedData);
    }

    // Define the common query options
    const queryOptions = {
      where: {
        end_date: { [Op.gte]: new Date() },
      },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["name"],
        },
      ],
    };

    if (id) {
      queryOptions.where = { id };
      const result = await Event.findOne(queryOptions);
      await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
      return res.status(200).send(result);
    } else if (event_name) {
      queryOptions.where = { event_name };
      const result = await Event.findOne(queryOptions);
      await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
      return res.status(200).send(result);
    } else if (category_id) {
      queryOptions.where = { category_id };
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }
      const results = await Event.findAll(queryOptions);
      await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
      return res.status(200).send(results);
    } else if (event_category) {
      queryOptions.include.push({
        model: Category,
        as: "category",
        where: { name: event_category },
      });
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }
      const results = await Event.findAll(queryOptions);
      await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
      return res.status(200).send(results);
    } else if (search) {
      queryOptions.where = {
        [Op.or]: [
          { event_name: { [Op.like]: `%${search}%` } },
          { event_description: { [Op.like]: `%${search}%` } },
        ],
      };
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }
      const results = await Event.findAll(queryOptions);
      await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
      return res.status(200).send(results);
    } else {
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }
      const results = await Event.findAll(queryOptions);
      // await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
      return res.status(200).send(results);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const EventsthisWeek = async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today.setDate(diff + 6));
    endOfWeek.setHours(23, 59, 59, 999);

    const cacheKey = "eventsthisweek";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).send(parsedData);
    }

    const weeklyEvents = await Event.findAll({
      include: [{
        model: Session,
        as: "session",
        required: true,
        include: [{
          model: Ticket,
          as: "ticket",
          required: true,
          where: {
            ticket_date: {
              [Op.between]: [startOfWeek, endOfWeek],
            },
          },
        }],
      }],
      where: {
        [Op.and]: [
          {
            start_date: {
              [Op.lte]: endOfWeek,
            },
          },
          {
            [Op.or]: [
              { end_date: { [Op.gte]: startOfWeek } },
              { end_date: null }, // Include events that do not have an end date
            ],
          },
        ],
      },
    });

    await redis.set(cacheKey, JSON.stringify(weeklyEvents), "EX", 3600);
    return res.status(200).json(weeklyEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getNightEvents = async (req, res) => {
  try {
    const lateTime = "19:00:00";
    const cacheKey = "Night Events";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).send(parsedData);
    }
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
    await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching sessions" });
  }
};

const getTodayEvent = async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = moment(today).format("YYYY-MM-DD");
    const cacheKey = "Today Events";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).send(parsedData);
    }

    const results = await Event.findAll({
      include: {
        model: Session,
        as: "session",
        required: true,
        include: {
          model: Ticket,
          as: "ticket",
          where: {
            ticket_date: {
              [Op.eq]: formattedDate,
            },
          },
          required: true,
        },
      },
    });
    await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
    return res.status(200).json(results);
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
      return res.status(404).json({ error: "Event not found" });
    }
    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEventsByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    console.log("Received tags:", tags); // Debugging

    // Ensure tags are split correctly into an array
    const tagsArray = typeof tags === 'string' ? tags.split(',') : [];
    console.log("Parsed tags array:", tagsArray); // Debugging

    if (tagsArray.length === 0) {
      return res.status(400).json({ error: "Tags query parameter is required" });
    }

    const cacheKey = `events_by_tags_${tagsArray.join('_')}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).send(parsedData);
    }

    // Use Op.like to handle tags stored as comma-separated strings
    const likeConditions = tagsArray.map(tag => ({
      tags: { [Op.like]: `%${tag.trim()}%` }
    }));

    const queryOptions = {
      where: {
        [Op.and]: likeConditions,
        end_date: { [Op.gte]: new Date() },
      },
    };

    const results = await Event.findAll(queryOptions);
    console.log("Query results:", results); // Debugging

    await redis.set(cacheKey, JSON.stringify(results), "EX", 3600);
    return res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching events by tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = {
  getEvents,
  getEventsbyId,
  deleteEvent,
  createEvent,
  EventsthisWeek,
  getNightEvents,
  getTodayEvent,
  newEvent,
  getEventsByTags
};
