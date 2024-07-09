const request = require("supertest");
const {
  getNearbyEvents,
  updateLocation,
  getUserLocation,
  getNearbyEventsSortedByDistance,
} = require("../Controllers/restaurantcontroller");
const { restaurant, events } = require("../models");

jest.mock("../models");
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (angle) => angle * (Math.PI / 180.0);

  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Apply formula
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLon / 2), 2);
  const rad = 6371; 
  const c = 2 * Math.asin(Math.sqrt(a));
  return rad * c;
}

describe("Restaurant Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    restaurant.findAll.mockClear();
  });

  it("should return 400 if user location is not available", async () => {
    const mockError = new Error("User location not available");
    await getNearbyEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "User location not available",
    });
  });
  it("should return nearby events within maxDistance", async () => {
    req.query = { maxDistance: 10 };
    userLocation = { latitude: 40.7128, longitude: -74.006 };

    const mockRestaurants = [
      {
        latitude: 40.7128,
        longitude: -74.006,
        events: [
          { id: 1, event_name: "Event 1" },
          { id: 2, event_name: "Event 2" },
        ],
      },
      {
        latitude: 40.7138,
        longitude: -74.006,
        events: [{ id: 3, event_name: "Event 3" }],
      },
    ];

    restaurant.findAll.mockResolvedValue(mockRestaurants);

    await getNearbyEvents(req, res);
    mockRestaurants.forEach((restaurant) => {
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
    });

    expect(restaurant.findAll).toHaveBeenCalledTimes(0);
  });

  describe("updateLocation", () => {
    it("should update user location and fetch nearby events", async () => {
      req.body = { latitude: 40.7128, longitude: -74.006 };

      const mockRestaurants = [
        {
          latitude: 40.7128,
          longitude: -74.006,
          events: [
            { id: 1, event_name: "Event 1" },
            { id: 2, event_name: "Event 2" },
          ],
        },
      ];

      restaurant.findAll.mockResolvedValue(mockRestaurants);

      await updateLocation(req, res);

      expect(userLocation).toEqual({ latitude: 40.7128, longitude: -74.006 });
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, event_name: "Event 1" },
        { id: 2, event_name: "Event 2" },
      ]);
    });

    it("should return 400 for invalid location data", async () => {
      req.body = { latitude: null, longitude: null };

      await updateLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid location data" });
    });
  });

  describe("getUserLocation", () => {
    it("should return the current user location", () => {
      userLocation = { latitude: 40.7128, longitude: -74.006 };

      const location = getUserLocation();

      expect(location).toEqual({ latitude: 40.7128, longitude: -74.006 });
    });
  });

  describe("getNearbyEventsSortedByDistance", () => {
    it("should return events sorted by distance", async () => {
      req.query = { maxDistance: 10 };
      userLocation = { latitude: 40.7128, longitude: -74.006 };

      const mockRestaurants = [
        {
          latitude: 40.7128,
          longitude: -74.006,
          events: [{ id: 1, event_name: "Event 1" }],
        },
        {
          latitude: 40.7138,
          longitude: -74.006,
          events: [{ id: 2, event_name: "Event 2" }],
        },
      ];

      restaurant.findAll.mockResolvedValue(mockRestaurants);

      await getNearbyEventsSortedByDistance(req, res);

      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: 1, event_name: "Event 1" }),
        expect.objectContaining({ id: 2, event_name: "Event 2" }),
      ]);
    });

    it("should handle errors", async () => {
      restaurant.findAll.mockRejectedValue(new Error("Database error"));

      await getNearbyEventsSortedByDistance(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while fetching events",
      });
    });
  });
});
