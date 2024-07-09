const request = require('supertest');
const express = require('express');

const {
  createEventException,
  updateEventException,
  deleteEventException,
} = require('../Controllers/eventexception');

jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const EventExceptionMock = dbMock.define('event_exception', {
    id: 1,
    session_id: 1,
    start_date: '2024-08-12', // Date should be a string
    end_date: '2024-08-12', // Date should be a string
    day: 'monday',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const SessionMock = dbMock.define('session', {
    id: 1,
    start_time: '20:00:00',
    eventId: 1,
  });
  EventExceptionMock.belongsTo(SessionMock, { as: 'session' });

  // Mocking findByPk method
  EventExceptionMock.findByPk = async (id) => {
    return await EventExceptionMock.findById(id); // Assuming you have a findById method in sequelize-mock
  };

  return {
    sequelize: dbMock,
    Sequelize: SequelizeMock,
    event_exception: EventExceptionMock,
    session: SessionMock,
  };
});

const app = express();
app.use(express.json());

app.post('/event-exceptions', createEventException);
app.put('/event-exceptions/:id', updateEventException);
app.delete('/event-exceptions/:id', deleteEventException);

describe('Event exception controller', () => {
  it('should create event-exception', async () => {
    const newEventExceptionData = {
      session_id: 1,
      start_date: '2024-08-12',
      end_date: '2024-08-12',
      day: 'monday',
    };

    const res = await request(app)
      .post('/event-exceptions')
      .send(newEventExceptionData);
     

    expect(res.status).toBe(201);
    expect(res.body.session_id).toBe(newEventExceptionData.session_id);
    expect(res.body.start_date).toBe(newEventExceptionData.start_date);
    expect(res.body.end_date).toBe(newEventExceptionData.end_date);
    expect(res.body.day).toBe(newEventExceptionData.day);
  });

  it('should update event-exception', async () => {
    const updateEventExceptionData = {
      session_id: 2,
      start_date: '2025-08-12',
      end_date: '2025-08-12',
      day: 'tuesday',
    };

    const res = await request(app)
      .put('/event-exceptions/1')
      .send(updateEventExceptionData);
      console.error('Response body:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.session_id).toBe(updateEventExceptionData.session_id);
    expect(res.body.start_date).toBe(updateEventExceptionData.start_date);
    expect(res.body.end_date).toBe(updateEventExceptionData.end_date);
    expect(res.body.day).toBe(updateEventExceptionData.day);
  });

  it('should delete an event-exception', async () => {
    const res = await request(app)
      .delete('/event-exceptions/1'); // Assuming event exception ID 1 exists for delete

    expect(res.status).toBe(204); // Assuming deletion returns 204 (No Content)
  });
});
