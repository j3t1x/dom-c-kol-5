const request = require("supertest");
const app = require("../app");
const ShoppingList = require("../models/ShoppingList");

jest.mock("../models/ShoppingList", () => ({
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe("DELETE /shoppingLists/:listId - Delete a shopping list", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should delete a shopping list with a valid ID and proper permissions", async () => {
    const mockShoppingList = {
      _id: "mocked-id",
      title: "Test Shopping List",
      members: [{ userId: "mocked-owner-id", role: "Owner" }],
    };

    ShoppingList.findById.mockResolvedValue(mockShoppingList); // Mock findById
    ShoppingList.findByIdAndDelete.mockResolvedValue(mockShoppingList); // Mock findByIdAndDelete

    const response = await request(app)
      .delete("/shoppingLists/mocked-id")
      .set("user-id", "mocked-owner-id");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "success" });
  });

  it("should return 404 if the shopping list does not exist", async () => {
    ShoppingList.findById.mockResolvedValue(null);
    ShoppingList.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app)
      .delete("/shoppingLists/non-existent-id")
      .set("user-id", "mocked-owner-id");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ error: "Shopping list not found" });
  });

  it("should return 500 if there is a database error", async () => {
    ShoppingList.findById.mockRejectedValue(new Error("Database error"));
    ShoppingList.findByIdAndDelete.mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .delete("/shoppingLists/mocked-id")
      .set("user-id", "mocked-owner-id");

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({ error: "Database error" });
  });
});

