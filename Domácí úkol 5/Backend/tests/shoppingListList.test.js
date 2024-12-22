const request = require('supertest');
const app = require('../app');
const ShoppingList = require('../models/ShoppingList');

jest.mock('../models/ShoppingList'); // Mock the ShoppingList model

describe("GET /shoppingLists/my-lists - Fetch shopping lists visible to the user", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // === Test 1: Successfully fetch all shopping lists for a user ===
  it("should fetch all shopping lists visible to the user", async () => {
    const mockData = [
      {
        _id: "mocked-id-1",
        title: "Groceries",
        members: [{ userId: "user123", role: "Owner" }],
        isArchived: false,
        items: [],
      },
      {
        _id: "mocked-id-2",
        title: "Work",
        members: [{ userId: "user123", role: "Member" }],
        isArchived: true,
        items: [],
      },
    ];

    // Mock find to return the mockData
    ShoppingList.find = jest.fn().mockResolvedValue(mockData);

    const response = await request(app)
      .get("/shoppingLists/my-lists") // Use the correct route
      .set("user-id", "user123"); // Add user-id header

    expect(response.status).toBe(200); // Status should be 200 (OK)
    expect(response.body).toMatchObject({
      status: "success",
      shoppingLists: mockData,
    }); // Response matches the structure
  });

  // === Test 2: Return empty list if user has no shopping lists ===
  it("should return an empty list if the user has no shopping lists", async () => {
    ShoppingList.find = jest.fn().mockResolvedValue([]); // Mock find to return an empty array

    const response = await request(app)
      .get("/shoppingLists/my-lists") // Use the correct route
      .set("user-id", "user123"); // Add user-id header

    expect(response.status).toBe(200); // Status should be 200 (OK)
    expect(response.body).toMatchObject({
      status: "success",
      shoppingLists: [],
    }); // Response matches the structure
  });

  // === Test 3: Return 400 if user-id is missing ===
  it("should return 400 if user-id is missing", async () => {
    const response = await request(app)
      .get("/shoppingLists/my-lists"); // No user-id header

    expect(response.status).toBe(400); // Status should be 400 (Bad Request)
    expect(response.body).toEqual({
      error: "User ID is required",
    });
  });

  // === Test 4: Return 500 if database error ===
  it("should return 500 if there is a database error", async () => {
    ShoppingList.find = jest.fn().mockRejectedValue(new Error("Database error")); // Mock find to throw an error

    const response = await request(app)
      .get("/shoppingLists/my-lists") // Use the correct route
      .set("user-id", "user123"); // Add user-id header

    expect(response.status).toBe(500); // Status should be 500 (Internal Server Error)
    expect(response.body).toEqual({
      error: "Database error",
    });
  });
});
