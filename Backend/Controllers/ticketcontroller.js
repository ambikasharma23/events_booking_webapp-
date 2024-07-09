const db = require("../models");
const { Op } = require("sequelize");
const Session = db.session;
const Ticket = db.ticket;
const Event = db.events;
const EventException = db.event_exception;
const ticket_inventory = db.ticket_inventory;

const getTicket = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let results;

    if (sessionId) {
      results = await Ticket.findAll({
        where: {
          session_id: sessionId,
          ticket_date: {
            [Op.gte]: today,
          },
        },
        include: [
          {
            model: ticket_inventory,
            as: "ticket_inventory",
            where: { quantity: { [Op.gt]: 0 } },
          },
        ],
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTicket = async (req, res) => {
  try {
    const {
      session_id,
      ticket_name,
      cost,
      actual_price,
      display_price,
      capacity,
    } = req.body;
    const session = await Session.findOne({
      where: { id: session_id },
      include: [{ model: Event, as: "events" }],
    });

    if (!session || !session.events) {
      return res
        .status(400)
        .json({ error: "Session or associated event not found" });
    }

    const { start_date, end_date, custom_day } = session.events;
    const eventStart = new Date(start_date);
    const eventEnd = end_date ? new Date(end_date) : null;

    const exceptions = await EventException.findAll({
      where: { session_id },
      attributes: ["start_date", "end_date"],
    });

    const exceptionRanges = exceptions.map((ex) => ({
      ExStart: new Date(ex.start_date),
      ExEnd: ex.end_date ? new Date(ex.end_date) : new Date(ex.start_date),
    }));

    const ticketData = [];

    const daysOfWeek = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const customDays = custom_day
      .toLowerCase()
      .split(",")
      .map((day) => day.trim());

    let d = new Date(eventStart);
    while (!eventEnd || d <= eventEnd) {
      const isException = exceptionRanges.some(
        (range) => d >= range.ExStart && d <= range.ExEnd
      );
      const dayOfWeek = d.getDay();
      const isCustomDay = customDays.includes(
        Object.keys(daysOfWeek).find((key) => daysOfWeek[key] === dayOfWeek)
      );

      if (!isException && isCustomDay) {
        ticketData.push({
          session_id,
          ticket_date: new Date(d),
          ticket_name,
          cost,
          actual_price,
          display_price,
          capacity,
        });
      }

      d.setDate(d.getDate() + 1);
    }

    const ticketPromises = ticketData.map((ticket) => Ticket.create(ticket));

    const tickets = await Promise.all(ticketPromises);
    res.status(201).json({ tickets });
  } catch (err) {
    res.status(500).json({ error: "Error during ticket creation" });
  }
};

// api for updating ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Ticket.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedTicket = await Ticket.findByPk(id);
      res.status(200).json(updatedTicket);
    } else {
      throw new Error("Ticket not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ticket.destroy({
      where: { id: id },
    });
    if (deleted) {
      res.status(204).send("Ticket deleted successfully");
    } else {
      throw new Error("Ticket not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicket,
};
