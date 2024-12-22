import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchShoppingList,
  addItem,
  deleteItem,
  toggleItemStatus,
  addMember,
  removeMember,
  leaveList,
} from "../api";
import { useUser } from "./UserSwitcher"; // Kontext uživatele
import { useLanguage } from "./LanguageContext"; // Kontext pro jazyk
import "./ShoppingListDetail.css";

const ShoppingListDetail = () => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const { currentUser } = useUser();
  const { language, translations } = useLanguage(); // Překlady a aktuální jazyk

  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const response = await fetchShoppingList(id, currentUser.id);
        setShoppingList({
          id: response.data.shoppingList._id,
          ...response.data.shoppingList,
        });
      } catch (error) {
        console.error("Failed to fetch shopping list:", error);
      }
    };

    if (id && currentUser) {
      loadShoppingList();
    }
  }, [id, currentUser]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      const response = await addItem(id, newItem, 1, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          { id: response.data.itemId, name: newItem, purchased: false },
        ],
      }));
      setNewItem("");
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(id, itemId, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
      }));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleToggleItem = async (itemId, newStatus) => {
    try {
      await toggleItemStatus(id, itemId, newStatus, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item._id === itemId ? { ...item, purchased: newStatus } : item
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle item status", error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId.trim()) {
      console.error("Member ID is required.");
      return;
    }

    try {
      await addMember(id, newMemberId, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        members: [...prev.members, { id: newMemberId, name: `User ${newMemberId}` }],
      }));
      setNewMemberId("");
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(id, memberId, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        members: prev.members.filter((member) => member.userId !== memberId),
      }));
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const handleLeaveList = async () => {
    try {
      await leaveList(id, currentUser.id);
      alert(translations[language].leaveListMessage);
      setShoppingList(null);
    } catch (error) {
      console.error("Failed to leave the list:", error);
    }
  };

  if (!shoppingList) return <div>{translations[language].loading}</div>;

  return (
    <div className="shopping-list-detail">
      <h1>{shoppingList.title}</h1>

      {/* Items Section */}
      <div className="items-section">
        <h2>{translations[language].items}</h2>
        <ul className="items-list">
          {shoppingList.items.map((item) => (
            <li key={item._id} className="item-row">
              <span>{item.name}</span>
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => handleToggleItem(item._id, !item.purchased)}
              />
              <button onClick={() => handleDeleteItem(item._id)}>
                {translations[language].delete}
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={translations[language].addItemPlaceholder}
        />
        <button onClick={handleAddItem}>{translations[language].addItem}</button>
      </div>

      {/* Members Section */}
      <div className="members-section">
        <h2>{translations[language].members}</h2>
        <ul>
          {shoppingList.members.map((member) => (
            <li key={member.userId}>
              {member.name}
              <button onClick={() => handleRemoveMember(member.userId)}>
                {translations[language].removeMember}
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
          placeholder={translations[language].addMemberPlaceholder}
        />
        <button onClick={handleAddMember}>{translations[language].addMember}</button>
        <button onClick={handleLeaveList} className="leave-button">
          {translations[language].leaveList}
        </button>
      </div>
    </div>
  );
};

export default ShoppingListDetail;
