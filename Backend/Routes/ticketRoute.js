const express = require("express");
const router = express.Router();
const ticketController = require("../Controllers/ticketcontroller");

router.post("/ticket/create", ticketController.createTicket);
router.put("/ticket/:id", ticketController.updateTicket);
router.delete("/ticket/:id", ticketController.deleteTicket);

module.exports = router;
