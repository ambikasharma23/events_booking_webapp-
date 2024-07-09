const request = require('supertest');
const express = require('express');
const { getEvents, getEventsbyId, deleteEvent, createEvent, EventsthisWeek, getNightEvents, getTodayEvent, newEvent } = require('../Controllers/eventController');

jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const EventMock = dbMock.define('event', {
    id: 1,
    event_name: 'Test Event',
    category_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Mock methods for EventMock
  EventMock.findByPk = jest.fn().mockResolvedValue(EventMock);
  EventMock.destroy = jest.fn().mockResolvedValue(true);

  const CityMock = dbMock.define('city', {
    id: 1,
    name: 'Test City',
  });

  const SessionMock = dbMock.define('session', {
    id: 1,
    start_time: '20:00:00',
    eventId: 1,
  });

  const CategoryMock = dbMock.define('event_category', {
    id: 1,
    name: 'Test Category',
  });

  const TicketMock = dbMock.define('ticket', {
    id: 1,
    ticket_date: new Date(),
    sessionId: 1,
  });

  EventMock.belongsTo(CityMock, { as: 'city' });
  EventMock.hasMany(SessionMock, { as: 'session' });
  SessionMock.belongsTo(EventMock);
  SessionMock.hasMany(TicketMock, { as: 'ticket' });
  TicketMock.belongsTo(SessionMock);
  EventMock.belongsTo(CategoryMock, { as: 'category' });

  return {
    sequelize: dbMock,
    Sequelize: SequelizeMock,
    events: EventMock,
    City: CityMock,
    session: SessionMock,
    event_category: CategoryMock,
    ticket: TicketMock,
  };
});

const app = express();
app.use(express.json());

app.get('/events', getEvents);
app.get('/events/:id', getEventsbyId);
app.post('/events', createEvent);
app.delete('/delete/:id', deleteEvent);
app.get('/events-this-week', EventsthisWeek);
app.get('/night-events', getNightEvents);
app.get('/today-events', getTodayEvent);
app.get('/new-events', newEvent);

describe('Event Controller', () => {
  it('should fetch all events', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch event by ID', async () => {
    const res = await request(app).get('/events/1');
    expect(res.status).toBe(200);
    expect(Number(res.body.id)).toBe(1);
  });

  it('should create a new event', async () => {
    const newEvent = {
      event_name: 'New Test Event',
      category_id: 1,
    };

    const res = await request(app).post('/events').send(newEvent);
    expect(res.status).toBe(201);
    expect(res.body.newEvent).toHaveProperty('event_name', 'New Test Event');
  });

  it('should delete an event by ID', async () => {
    const res = await request(app).delete('/delete/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Event deleted successfully');
  });

  it('should fetch events of this week', async () => {
    const res = await request(app).get('/events-this-week');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch night events', async () => {
    const res = await request(app).get('/night-events');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch today\'s events', async () => {
    const res = await request(app).get('/today-events');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch new events', async () => {
    const res = await request(app).get('/new-events');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
