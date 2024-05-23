const db = require('../models');
const TicketInventory = db.ticket_inventory;

const createTicketInventoryController = async (req, res) => {
  try {
    const { ticket_id, quantity, days } = req.body;
    const inventories = [];

    for (let i = 0; i < days; i++) {
      const inventory = await TicketInventory.create({
        ticket_id,
        quantity,
        created_at: new Date(),
        updated_at: new Date(),
      });

      inventories.push(inventory);
    }

    res.status(201).json(inventories);
  } catch (error) {
    console.error("Error creating ticket inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTicketInventoryController = async (req, res) => {
  try {
    const { ticket_id, no_of_person } = req.body;
    const inventory = await TicketInventory.findOne({ where: { ticket_id } });

    if (!inventory) {
      throw new Error('Ticket inventory not found');
    }

    if (inventory.quantity < no_of_person) {
      throw new Error('Not enough tickets available');
    }

    inventory.quantity -= no_of_person;
    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating ticket inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTicketInventory: createTicketInventoryController,
  updateTicketInventory: updateTicketInventoryController
};
