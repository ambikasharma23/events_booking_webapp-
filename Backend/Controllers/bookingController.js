const {
  ticket,
  ticket_inventory,
  event_booking,
  Sequelize,
} = require("../models");
const { Op } = Sequelize;

const createBooking = async (req, res) => {
  const {
    customer_id,
    name,
    contact,
    ticket_id,
    status,
    booking_date,
    no_of_persons,
  } = req.body;

  try {
    const inventory = await ticket_inventory.findOne({
      where: { ticket_id },
    });
    if (!ticket_id) {
      return res.status(404).json({ error: "Please select tickets" });
    }
    if (!inventory) {
      return res.status(404).json({ error: "Ticket inventory not found" });
    }

    if (inventory.quantity < no_of_persons) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    const booking = await event_booking.create({
      customer_id,
      name,
      contact,
      ticket_id,
      status,
      booking_date,
      no_of_persons,
    });

    inventory.quantity -= no_of_persons;
    await inventory.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getBookingById = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const booking = await event_booking.findOne({
      where: { id: booking_id },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await event_booking.findAll({
      include: [
        {
          model: ticket,
          as: "ticket",
          include: [
            {
              model: ticket_inventory,
              as: "ticket_inventory",
            },
          ],
        },
      ],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getBookingByCustId = async (req, res) => {
  try {
    const { custId } = req.params;
    const bookings = await event_booking.findAll({
      where: { customer_id: custId },
    });
    if (bookings && bookings.length > 0) {
      res.status(200).json(bookings);
    } else {
      throw new Error("Booking not found for the customer");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingByCustId,
  getBookingById,
};
