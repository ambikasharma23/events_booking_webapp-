const express = require("express");
const router = express.Router();
const ticketController = require("../Controllers/ticketcontroller");

// Create a ticket for a particular event
router.post("/ticket/create", ticketController.createTicket);

// Update a ticket by ID
router.put("/ticket/:id", ticketController.updateTicket);

// Delete a ticket by ID
router.delete("/ticket/:id", ticketController.deleteTicket);

module.exports = router;
