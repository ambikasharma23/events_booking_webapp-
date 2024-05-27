const db = require("../models");
const Event = db.events;
const Ticket = db.ticket;
const Session = db.session;

const eventDate=async(req,res)=>{
  try{
  const results = await Event.findAll({
    order: [["start_date", "ASC"]],
  })
  res.status(200).json(results);
}
catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error while sorting events on the basis of date" });
}
};

const eventCost = async (req, res) => {
  try {
    const sort = req.query.sort;

    if (sort === "asc") {
      order = [["sessions", "tickets", "display_price", "ASC"]];
    }
    if (sort === "desc") {
      order = [["sessions", "tickets", "display_price", "DESC"]];
    }
    const events = await Event.findAll({
      include: [
        {
          model: Session,
          as: "sessions",
          include: [
            {
              model: Ticket,
              as: "tickets",
              attributes: ["display_price"],
            },
          ],
        },
      ],
      order: order,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while sorting events" });
  }
};

module.exports = { eventCost, eventDate };
