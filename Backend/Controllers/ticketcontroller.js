const db = require("../models");
const Ticket = db.ticket;

const getTicket = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    let results;
    if (sessionId) {
      results = await Ticket.findOne({ where: { session_id: sessionId } });
    }
    res.status(200).send(results);
  } catch (error) {
    console.error("Error handling request:", error);
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

    const { start_date, end_date, recurrent_type } = session.events;
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : null;

    const ticketPromises = [];

    if (endDate) {
      let d = new Date(startDate);
      while (d <= endDate) {
        const ticketDate = new Date(d);
        ticketPromises.push(
          Ticket.create({
            session_id,
            ticket_date: ticketDate,
            ticket_name,
            cost,
            actual_price,
            display_price,
            capacity,
          })
        );
        if (recurrent_type === "daily") {
          d = new Date(d.setDate(d.getDate() + 1));
        }
        if (recurrent_type === "weekly") {
          d = new Date(d.setDate(d.getDate() + 7));
        } else if (recurrent_type === "monthly") {
          d = new Date(d.setMonth(d.getMonth() + 1));
        } else {
          break; 
        }
      }
    } else {
      ticketPromises.push(
        Ticket.create({
          session_id,
          ticket_date: startDate,
          ticket_name,
          cost,
          actual_price,
          display_price,
          capacity,
        })
      );
    }

    const tickets = await Promise.all(ticketPromises);
    res.status(201).json({ tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during insertion" });
  }
};

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
      res.status(204).send();
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
