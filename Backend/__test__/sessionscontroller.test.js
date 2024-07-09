const { createSession, updateSession, deleteSession, getSessionsByEventId } = require('../Controllers/sessionscontroller');
const db = require('../models');
const Session = db.session;

jest.mock('../models'); 

describe('Session Controller Tests', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    test('should create a new session', async () => {
      const sessionData = { id: 1, name: 'Test Session' };
      mockRequest.body = sessionData;

      Session.create.mockResolvedValue(sessionData);

      await createSession(mockRequest, mockResponse);

      expect(Session.create).toHaveBeenCalledWith(sessionData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(sessionData);
    });

    test('should return error on creation failure', async () => {
      const errorMessage = 'Error creating session';
      mockRequest.body = { name: 'Test Session' };

      Session.create.mockRejectedValue(new Error(errorMessage));

      await createSession(mockRequest, mockResponse);

      expect(Session.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateSession', () => {
    test('should update an existing session', async () => {
      const sessionId = 1;
      const sessionData = { name: 'Updated Session' };
      const updatedSession = { id: sessionId, ...sessionData };
      mockRequest.params.id = sessionId;
      mockRequest.body = sessionData;

      Session.update.mockResolvedValue([1]);
      Session.findByPk.mockResolvedValue(updatedSession);

      await updateSession(mockRequest, mockResponse);

      expect(Session.update).toHaveBeenCalledWith(sessionData, { where: { id: sessionId } });
      expect(Session.findByPk).toHaveBeenCalledWith(sessionId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedSession);
    });

    test('should return error if session not found', async () => {
      const sessionId = 1;
      const sessionData = { name: 'Updated Session' };
      mockRequest.params.id = sessionId;
      mockRequest.body = sessionData;

      Session.update.mockResolvedValue([0]);

      await updateSession(mockRequest, mockResponse);

      expect(Session.update).toHaveBeenCalledWith(sessionData, { where: { id: sessionId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Session not found' });
    });

    test('should return error on update failure', async () => {
      const sessionId = 1;
      const sessionData = { name: 'Updated Session' };
      const errorMessage = 'Error updating session';
      mockRequest.params.id = sessionId;
      mockRequest.body = sessionData;

      Session.update.mockRejectedValue(new Error(errorMessage));

      await updateSession(mockRequest, mockResponse);

      expect(Session.update).toHaveBeenCalledWith(sessionData, { where: { id: sessionId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteSession', () => {
    test('should delete an existing session', async () => {
      const sessionId = 1;
      mockRequest.params.id = sessionId;

      Session.destroy.mockResolvedValue(1);

      await deleteSession(mockRequest, mockResponse);

      expect(Session.destroy).toHaveBeenCalledWith({ where: { id: sessionId } });
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith('Event deleted successfully');
    });

    test('should return error if session not found', async () => {
      const sessionId = 1;
      mockRequest.params.id = sessionId;

      Session.destroy.mockResolvedValue(0);

      await deleteSession(mockRequest, mockResponse);

      expect(Session.destroy).toHaveBeenCalledWith({ where: { id: sessionId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Session not found' });
    });

    test('should return error on delete failure', async () => {
      const sessionId = 1;
      const errorMessage = 'Error deleting session';
      mockRequest.params.id = sessionId;

      Session.destroy.mockRejectedValue(new Error(errorMessage));

      await deleteSession(mockRequest, mockResponse);

      expect(Session.destroy).toHaveBeenCalledWith({ where: { id: sessionId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getSessionsByEventId', () => {
    test('should fetch sessions by event ID', async () => {
      const eventId = 1;
      const sessions = [{ id: 1, event_id: eventId }, { id: 2, event_id: eventId }];
      mockRequest.params.eventId = eventId;

      Session.findAll.mockResolvedValue(sessions);

      await getSessionsByEventId(mockRequest, mockResponse);

      expect(Session.findAll).toHaveBeenCalledWith({ where: { event_id: eventId } });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(sessions);
    });

    test('should return error if sessions not found', async () => {
      const eventId = 1;
      mockRequest.params.eventId = eventId;

      Session.findAll.mockResolvedValue([]);

      await getSessionsByEventId(mockRequest, mockResponse);

      expect(Session.findAll).toHaveBeenCalledWith({ where: { event_id: eventId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sessions not found for the event' });
    });

    test('should return error on fetch failure', async () => {
      const eventId = 1;
      const errorMessage = 'Error fetching sessions';
      mockRequest.params.eventId = eventId;

      Session.findAll.mockRejectedValue(new Error(errorMessage));

      await getSessionsByEventId(mockRequest, mockResponse);

      expect(Session.findAll).toHaveBeenCalledWith({ where: { event_id: eventId } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
