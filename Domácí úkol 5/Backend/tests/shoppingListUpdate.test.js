const request = require("supertest");
const app = require("../app");
const ShoppingList = require("../models/ShoppingList");

jest.mock("../models/ShoppingList");

describe("PUT /shoppingLists/:listId - Update a shopping list", () => {
  const mockShoppingList = {
    _id: "mocked-id",
    title: "Groceries",
    members: [
      {
        userId: "mocked-owner-id",
        role: "Owner",
      },
    ],
    isArchived: false,
    items: [],
  };

  it("should update a shopping list with valid data and permissions", async () => {
    // Mock findById to return a shopping list with a mock save method
    ShoppingList.findById.mockResolvedValue({
      ...mockShoppingList,
      save: jest.fn().mockResolvedValue({
        ...mockShoppingList,
        title: "Updated Groceries",
      }),
    });

    const response = await request(app)
      .put("/shoppingLists/mocked-id")
      .set("user-id", "mocked-owner-id") // Mock owner
      .send({ title: "Updated Groceries" }); // Valid update payload

    // Assertions
    expect(response.status).toBe(200); // Status 200 for success
    expect(response.body).toMatchObject({
      status: "success",
      updatedShoppingList: {
        ...mockShoppingList,
        title: "Updated Groceries",
      },
    });
  });

  it("should return 400 if the title is invalid or missing", async () => {
    // Mock findById to return a shopping list
    ShoppingList.findById.mockResolvedValue({
      ...mockShoppingList,
      save: jest.fn(),
    });

    const response = await request(app)
      .put("/shoppingLists/mocked-id")
      .set("user-id", "mocked-owner-id") // Mock owner
      .send({ title: "" }); // Invalid title

    // Assertions
    expect(response.status).toBe(400); // Status 400 for bad request
    expect(response.body).toMatchObject({
      error: "Title is required",
    });
  });

  it("should return 404 if the shopping list does not exist", async () => {
    // Mock findById to return null
    ShoppingList.findById.mockResolvedValue(null);

    const response = await request(app)
      .put("/shoppingLists/non-existent-id")
      .set("user-id", "mocked-owner-id") // Mock owner
      .send({ title: "Updated Groceries" });

    // Assertions
    expect(response.status).toBe(404); // Status 404 for not found
    expect(response.body).toMatchObject({
      error: "Shopping list not found",
    });
  });

  it("should return 500 if there is a database error", async () => {
    // Mock findById to throw an error
    ShoppingList.findById.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put("/shoppingLists/mocked-id")
      .set("user-id", "mocked-owner-id") // Mock owner
      .send({ title: "Updated Groceries" });

    // Assertions
    expect(response.status).toBe(500); // Status 500 for server error
    expect(response.body).toMatchObject({ error: "Database error" });
  });
});
