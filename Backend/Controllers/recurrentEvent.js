const db = require("../models");
const Event = db.events;

const updateEvent = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        is_recurrent: true,
      },
    });
    const updateDate = events.map(async (events) => {
      const newDate = new Date(events.start_date);
      switch (events.recurrent_type) {
        case "daily":
          newDate.setDate(newDate.getDate() + 1);
          break;
        case "weekly":
          newDate.setDate(newDate.getDate() + 7);
          break;
        case "monthly":
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        default:
          console.error("Unknown recurrent_type:", events.recurrent_type);
          return;
      }
      events.start_date = newDate;
      return await events.save();
    });
    await Promise.all(updateDate);
    console.log("Event dates updated");
  } catch {
    console.error("Error updating event dates:", error);
  }
};

module.exports = updateEvent;
