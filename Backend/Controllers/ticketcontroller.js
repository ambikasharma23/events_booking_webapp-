const { Ticket } = require('../models'); // Assuming your ticket model file is named ticket.js

const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Ticket.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedTicket = await Ticket.findByPk(id);
            res.status(200).json(updatedTicket);
        } else {
            throw new Error('Ticket not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ticket.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Ticket not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createTicket,
    updateTicket,
    deleteTicket
};
