const request = require('supertest');
const app = require('../app'); // Ensure the path to your app is correct
const ShoppingList = require('../models/ShoppingList'); // Path to ShoppingList model

jest.mock('../models/ShoppingList'); // Mock the ShoppingList model

describe("POST /add - Create Shopping List", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test: Successful creation with a valid title and user-id
  it("should create a shopping list with valid input", async () => {
    ShoppingList.prototype.save = jest.fn().mockResolvedValue({
      _id: "mocked-id",
      title: "Groceries",
      members: [{ userId: "user123", role: "Owner" }],
      isArchived: false,
      items: [],
    });

    const response = await request(app)
      .post("/shoppingLists/add")
      .send({ title: "Groceries" }) // Valid title
      .set("user-id", "user123"); // Valid user-id in headers

    expect(response.status).toBe(201); // Status should be 201 (Created)
    expect(response.body).toMatchObject({
      status: "success",
      shoppingListId: expect.any(String), // Dynamically generated ID
    });
  });

  // Test: Missing title in the request body
  it("should return 400 if title is missing", async () => {
    const response = await request(app)
      .post("/shoppingLists/add")
      .set("user-id", "user123"); // Valid user-id but no title

    expect(response.status).toBe(400); // Status should be 400 (Bad Request)
    expect(response.body).toEqual({
      error: "Title and user ID are required",
    });
  });

  // Test: Missing user-id in headers
  it("should return 400 if user-id is missing", async () => {
    const response = await request(app)
      .post("/shoppingLists/add")
      .send({ title: "Groceries" }); // Valid title but no user-id

    expect(response.status).toBe(400); // Status should be 400 (Bad Request)
    expect(response.body).toEqual({
      error: "Title and user ID are required",
    });
  });

  // Test: Simulate database error during save
  it("should return 500 if there is a database error", async () => {
    ShoppingList.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/shoppingLists/add")
      .send({ title: "Groceries" })
      .set("user-id", "user123");

    expect(response.status).toBe(500); // Status should be 500 (Internal Server Error)
    expect(response.body).toEqual({
      error: "Database error",
    });
  });

  // Test: Empty title in the request body
  it("should return 400 if title is empty", async () => {
    const response = await request(app)
      .post("/shoppingLists/add")
      .send({ title: "" }) // Empty title
      .set("user-id", "user123");

    expect(response.status).toBe(400); // Status should be 400 (Bad Request)
    expect(response.body).toEqual({
      error: "Title and user ID are required",
    });
  });
});
