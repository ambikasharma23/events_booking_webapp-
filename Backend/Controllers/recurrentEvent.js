const db = require("../models");
const Event = db.events;

const updateEvent = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        is_recurrent: true,
      },
    });
    function getDays(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    const updateDate = events.map((event) => {
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
      }
      return event.save(); 
    });

    await Promise.all(updateDate);
    console.log("Event dates updated");
  } catch (error) {
    console.error("Error updating event dates:", error);
  }
};

module.exports = updateEvent;
