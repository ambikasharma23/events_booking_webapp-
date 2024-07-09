const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  createBooking,
  getBookings,
  getBookingByCustId,
  getBookingById,
} = require('../Controllers/bookingController');

jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const TicketMock = dbMock.define('ticket', {
    id: 1,
    event_id: 1,
    ticket_type: 'VIP',
  });

  const TicketInventoryMock = dbMock.define('ticket_inventory', {
    id: 1,
    ticket_id: 1,
    quantity: 100,
  });

  const EventBookingMock = dbMock.define('event_booking', {
    id: 1,
    customer_id: 1,
    name: 'John Doe',
    contact: '1234567890',
    ticket_id: 1,
    status: 'confirmed',
    booking_date: new Date(),
    no_of_persons: 2,
  });

  EventBookingMock.belongsTo(TicketMock, { as: 'ticket' });
  TicketMock.hasMany(TicketInventoryMock, { as: 'ticket_inventory' });

  return {
    Sequelize: SequelizeMock,
    ticket: TicketMock,
    ticket_inventory: TicketInventoryMock,
    event_booking: EventBookingMock,
  };
});

const app = express();
app.use(bodyParser.json());

app.post('/bookings', createBooking);
app.get('/bookings', getBookings);
app.get('/bookings/customer/:custId', getBookingByCustId);
app.get('/bookings/:booking_id', getBookingById);

describe('Booking Controller', () => {
  it('should create a booking', async () => {
    const bookingData = {
      customer_id: 1,
      name: 'John Doe',
      contact: '1234567890',
      ticket_id: 1,
      status: 'confirmed',
      booking_date: new Date(),
      no_of_persons: 2,
    };

    const res = await request(app).post('/bookings').send(bookingData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Booking created successfully');
    expect(res.body.booking).toHaveProperty('name', 'John Doe');
  });

  it('should fetch all bookings', async () => {
    const res = await request(app).get('/bookings');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch booking by ID', async () => {
    const res = await request(app).get('/bookings/1');
    expect(res.status).toBe(200);
    expect(res.body.booking).toHaveProperty('id', expect.anything());
    expect(parseInt(res.body.booking.id)).toBe(1);
  });

  it('should fetch bookings by customer ID', async () => {
    const res = await request(app).get('/bookings/customer/1');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('customer_id', expect.anything());
    expect(parseInt(res.body[0].customer_id)).toBe(1);
  });
});
