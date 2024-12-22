import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Shopping Lists
export const fetchShoppingList = (listId, userId) =>
  api.get(`/shoppingLists/${listId}`, {
    headers: { "user-id": userId },
  });

export const fetchShoppingLists = (userId) =>
  api.get("/shoppingLists/my-lists", {
    headers: { "user-id": userId },
  });

export const addShoppingList = (title, userId) =>
  api.post("/shoppingLists/add", { title }, {
    headers: { "user-id": userId },
  });

export const deleteShoppingList = (listId, userId) =>
  api.delete(`/shoppingLists/${listId}`, {
    headers: { "user-id": userId },
  });

  export const fetchArchivedShoppingLists = (userId) =>
    api.get("/shoppingLists/archived-lists", {
      headers: { "user-id": userId },
    });
  export const toggleArchiveStatus = (listId, isArchived, userId) =>
    api.patch(`/shoppingLists/${listId}/archive`, { isArchived }, {
      headers: { "user-id": userId },
    });
    
  
  
  

// Items
export const fetchItems = (listId, userId) =>
  api.get(`/shoppingLists/${listId}`, {
    headers: { "user-id": userId },
  });

export const addItem = (listId, itemName, quantity, userId) =>
  api.post(`/items/${listId}/add`, { itemName, quantity }, {
    headers: { "user-id": userId },
  });

export const deleteItem = (listId, itemId, userId) =>
  api.delete(`/items/${listId}/${itemId}`, {
    headers: { "user-id": userId },
  });

export const toggleItemStatus = (listId, itemId, purchased, userId) =>
  api.patch(`/items/${listId}/${itemId}`, { purchased }, {
    headers: { "user-id": userId },
  });

// Members
export const addMember = (listId, memberId, userId) =>
  api.post(
    `/members/${listId}/add-member`,
    { memberId }, // Odesíláme `memberId` v těle požadavku
    {
      headers: { "user-id": userId }, // Odesíláme `user-id` v hlavičkách
    }
  );

export const removeMember = (listId, memberId, userId) =>
  api.delete(`/members/${listId}/${memberId}`, {
    headers: { "user-id": userId },
  });

  export const leaveList = (listId, userId) =>
    api.delete(`/members/${listId}/leave`, {
      headers: { "user-id": userId },
    });
  