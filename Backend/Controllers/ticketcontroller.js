const db = require("../models");
const Ticket = db.ticket;
const Session = db.session;
const Event = db.events;

const getTicket = async(req,res)=>{
  try{
  const sessionId = req.query.session_id;
  let results;
  if (sessionId) {
    results = await Ticket.findOne({ where: { session_id: sessionId } });
  }
  res.status(200).send(results);
}catch (error) {
  console.error("Error handling request:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
}

const createTicket = async (req, res) => {
  try {
    const { session_id, ticket_date, ticket_name, cost, actual_price, display_price, capacity } = req.body;

    // Fetch the session and its associated event
    const session = await Session.findOne({
      where: { id: session_id },
      include: [{ model: Event, as: 'events' }],
    });

    if (!session || !session.events) {
      return res.status(400).json({ error: "Session or associated event not found" });
    }

    // Extract the start_date and end_date from the associated event
    const { start_date, end_date } = session.events;

    // Validate ticket_date
    if (new Date(ticket_date) < new Date(start_date) || new Date(ticket_date) > new Date(end_date)) {
      return res.status(400).json({ error: "ticket_date must be within the event's start_date and end_date range" });
    }

    // Create the ticket with the validated ticket_date
    const ticket = await Ticket.create({
      session_id,
      ticket_date,
      ticket_name,
      cost,
      actual_price,
      display_price,
      capacity,
    });

    res.status(201).json({ ticket });
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
  getTicket
};
