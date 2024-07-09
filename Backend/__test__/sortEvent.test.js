const { eventCost, eventDate } = require("../Controllers/sortEvent");
const db = require("../models");
const Event = db.events;
const Ticket = db.ticket;
const Session = db.session;

jest.mock("../models");

describe("Event Controller Tests", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("eventDate", () => {
    test("should sort events by date", async () => {
      const events = [
        { id: 1, start_date: "2023-07-01" },
        { id: 2, start_date: "2023-08-01" },
      ];
      Event.findAll.mockResolvedValue(events);

      await eventDate(mockRequest, mockResponse);

      expect(Event.findAll).toHaveBeenCalledWith({
        order: [["start_date", "ASC"]],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(events);
    });

    test("should return error on failure", async () => {
      const errorMessage = "Error while sorting events on the basis of date";
      Event.findAll.mockRejectedValue(new Error(errorMessage));

      await eventDate(mockRequest, mockResponse);

      expect(Event.findAll).toHaveBeenCalledWith({
        order: [["start_date", "ASC"]],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("eventCost", () => {
    test("should sort events by cost in ascending order", async () => {
      const events = [
        { id: 1, session: [{ ticket: { display_price: 100 } }] },
        { id: 2, session: [{ ticket: { display_price: 200 } }] },
      ];
      mockRequest.query.sort = "asc";
      Event.findAll.mockResolvedValue(events);

      await eventCost(mockRequest, mockResponse);

      expect(Event.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Session,
            as: "session",
            include: [
              {
                model: Ticket,
                as: "ticket",
                attributes: ["display_price"],
              },
            ],
          },
        ],
        order: [["session", "ticket", "display_price", "ASC"]],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(events);
    });

    test("should sort events by cost in descending order", async () => {
      const events = [
        { id: 1, session: [{ ticket: { display_price: 200 } }] },
        { id: 2, session: [{ ticket: { display_price: 100 } }] },
      ];
      mockRequest.query.sort = "desc";
      Event.findAll.mockResolvedValue(events);

      await eventCost(mockRequest, mockResponse);

      expect(Event.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Session,
            as: "session",
            include: [
              {
                model: Ticket,
                as: "ticket",
                attributes: ["display_price"],
              },
            ],
          },
        ],
        order: [["session", "ticket", "display_price", "DESC"]],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(events);
    });

    test("should return error on failure", async () => {
      const errorMessage = "Error while sorting events";
      mockRequest.query.sort = "asc";
      Event.findAll.mockRejectedValue(new Error(errorMessage));

      await eventCost(mockRequest, mockResponse);

      expect(Event.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Session,
            as: "session",
            include: [
              {
                model: Ticket,
                as: "ticket",
                attributes: ["display_price"],
              },
            ],
          },
        ],
        order: [["session", "ticket", "display_price", "ASC"]],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
