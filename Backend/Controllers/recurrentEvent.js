const db = require("../models");
const Event = db.events;
const Session = db.sessions;
const Ticket = db.tickets;
const TicketInventory = db.ticket_inventories;

const updateEvent = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        is_recurrent: true,
      },
      include: [
        { model: Session, as: "session" },
        {
          model: Ticket,
          as: "tickets",
          include: [{ model: TicketInventory, as: "ticket_inventory" }],
        },
      ],
    });

    function getDays(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    const updatePromises = events.map(async (event) => {
      event.recurrent_count = (event.recurrent_count || 0) + 1;

      const newDate = new Date(event.start_date);
      let shouldUpdate = false;

      switch (event.recurrent_type) {
        case "daily":
          newDate.setDate(newDate.getDate() + 1);
          shouldUpdate = true;
          event.recurrent_count = 0;
          break;
        case "weekly":
          if (event.recurrent_count > 7) {
            newDate.setDate(newDate.getDate() + 7);
            shouldUpdate = true;
            event.recurrent_count = 0;
          }
          break;
        case "monthly":
          const month = newDate.getMonth();
          const year = newDate.getFullYear();
          const days = getDays(year, month);
          console.log("days: ", days);
          if (event.recurrent_count > days) {
            newDate.setMonth(newDate.getMonth() + 1);
            shouldUpdate = true;
            event.recurrent_count = 0;
          }
          break;
        default:
          console.error("Unknown recurrent_type:", event.recurrent_type);
          return;
      }

      if (shouldUpdate) {
        event.start_date = newDate;

        // Update ticket inventory capacity
        event.tickets.forEach(async (ticket) => {
          if (ticket_inventory) {
            ticket_inventory.quantity = ticket.capacity;
            await ticket.inventory.save();
          }
        });

        await event.save();
      }
    });

    await Promise.all(updatePromises);
    console.log("Event dates and ticket inventory updated");
  } catch (error) {
    console.error("Error updating event dates and ticket inventory:", error);
  }
};

module.exports = updateEvent;
