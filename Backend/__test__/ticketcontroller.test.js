const { createTicket, updateTicket, deleteTicket, getTicket } = require('../Controllers/ticketcontroller');
const db = require('../models');
const { Op } = require('sequelize');

jest.mock('../models');

describe('Ticket Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTicket', () => {
    it('should return tickets for a given session ID', async () => {
      const mockTickets = [{ id: 1, name: 'Ticket 1' }];
      db.ticket.findAll.mockResolvedValue(mockTickets);
      req.query.session_id = 1;

      await getTicket(req, res);

      expect(db.ticket.findAll).toHaveBeenCalledWith({
        where: {
          session_id: 1,
          ticket_date: {
            [Op.gte]: expect.any(Date),
          },
        },
        include: [
          {
            model: db.ticket_inventory,
            as: 'ticket_inventory',
            where: { quantity: { [Op.gt]: 0 } },
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTickets);
    });
  });

  describe('createTicket', () => {
    it('should create tickets for valid session and event', async () => {
      req.body = {
        session_id: 1,
        ticket_name: 'Ticket',
        cost: 10,
        actual_price: 12,
        display_price: 11,
        capacity: 100,
      };
      db.session.findOne.mockResolvedValue({
        id: 1,
        events: {
          start_date: '2023-01-01',
          end_date: '2023-01-10',
          custom_day: 'monday',
        },
      });
      db.event_exception.findAll.mockResolvedValue([]);
      db.ticket.create.mockResolvedValue({ id: 1 });

      await createTicket(req, res);

      expect(db.session.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [{ model: db.events, as: 'events' }],
      });
      expect(db.ticket.create).toHaveBeenCalledTimes(2); // 2 Mondays between 1st and 10th January
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ tickets: [{ id: 1 }, { id: 1 }] });
    });

    it('should return 400 if session or event not found', async () => {
      db.session.findOne.mockResolvedValue(null);

      await createTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Session or associated event not found' });
    });

    it('should return 500 on error', async () => {
      db.session.findOne.mockRejectedValue(new Error('Database error'));

      await createTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error during ticket creation' });
    });
  });

  describe('updateTicket', () => {
    it('should update the ticket if found', async () => {
      req.params.id = 1;
      req.body = { ticket_name: 'Updated Ticket' };
      db.ticket.update.mockResolvedValue([1]);
      db.ticket.findByPk.mockResolvedValue({ id: 1, ticket_name: 'Updated Ticket' });

      await updateTicket(req, res);

      expect(db.ticket.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ticket_name: 'Updated Ticket' });
    });

    it('should return 400 if ticket not found', async () => {
      req.params.id = 1;
      req.body = { ticket_name: 'Updated Ticket' };
      db.ticket.update.mockResolvedValue([0]);

      await updateTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ticket not found' });
    });

    it('should return 400 on error', async () => {
      db.ticket.update.mockRejectedValue(new Error('Database error'));

      await updateTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('deleteTicket', () => {
    it('should delete the ticket if found', async () => {
      req.params.id = 1;
      db.ticket.destroy.mockResolvedValue(1);

      await deleteTicket(req, res);

      expect(db.ticket.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith('Ticket deleted successfully');
    });

    it('should return 400 if ticket not found', async () => {
      req.params.id = 1;
      db.ticket.destroy.mockResolvedValue(0);

      await deleteTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ticket not found' });
    });

    it('should return 400 on error', async () => {
      db.ticket.destroy.mockRejectedValue(new Error('Database error'));

      await deleteTicket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
