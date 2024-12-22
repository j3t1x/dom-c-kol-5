// shoppingListGet.test.js
const request = require("supertest");
const app = require("../app");
const ShoppingList = require("../models/ShoppingList");

jest.mock("../models/ShoppingList");

describe("GET /shoppingLists/:id - Fetch a single shopping list", () => {
  const mockShoppingList = {
    _id: "mocked-id",
    title: "Groceries",
    items: [],
    isArchived: false,
    members: [
      {
        userId: "user123",
        role: "Owner",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a shopping list with a valid ID and user-id", async () => {
    ShoppingList.findById.mockResolvedValue(mockShoppingList);

    const response = await request(app)
      .get("/shoppingLists/mocked-id")
      .set("user-id", "user123");

    expect(response.status).toBe(200); // Status should be 200 (OK)
    expect(response.body).toMatchObject({ shoppingList: mockShoppingList });
  });

  it("should return 404 if shopping list is not found", async () => {
    ShoppingList.findById.mockResolvedValue(null);

    const response = await request(app)
      .get("/shoppingLists/non-existent-id")
      .set("user-id", "user123");

    expect(response.status).toBe(404); // Status should be 404 (Not Found)
    expect(response.body).toEqual({ error: "Shopping list not found" });
  });

  it("should return 403 if the user is not a member of the list", async () => {
    const mockShoppingListNoAccess = {
      ...mockShoppingList,
      members: [{ userId: "differentUserId", role: "Member" }],
    };
    ShoppingList.findById.mockResolvedValue(mockShoppingListNoAccess);

    const response = await request(app)
      .get("/shoppingLists/mocked-id")
      .set("user-id", "user123");

    expect(response.status).toBe(403); // Status should be 403 (Forbidden)
    expect(response.body).toEqual({ error: "Access denied. Insufficient permissions." });
  });

  it("should return 500 if there is a database error", async () => {
    ShoppingList.findById.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/shoppingLists/mocked-id")
      .set("user-id", "user123");

    expect(response.status).toBe(500); // Status should be 500 (Internal Server Error)
    expect(response.body).toEqual({ error: "Database error" });
  });
});
