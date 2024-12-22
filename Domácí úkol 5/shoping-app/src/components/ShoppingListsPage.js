import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchShoppingLists,
  fetchArchivedShoppingLists,
  addShoppingList,
  deleteShoppingList,
  toggleArchiveStatus,
} from "../api";
import { useUser } from "./UserSwitcher"; // Kontext uživatele
import { useLanguage } from "./LanguageContext"; // Kontext pro jazyk
import "./ShoppingListsPage.css";

const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [listToDelete, setListToDelete] = useState(null);
  const [isArchivedView, setIsArchivedView] = useState(false); // Stav přepínače
  const { currentUser } = useUser();
  const { language, translations } = useLanguage(); // Překlady a aktuální jazyk

  useEffect(() => {
    const loadShoppingLists = async () => {
      if (!currentUser) return; // Pokud není aktuální uživatel, neprováděj načtení

      try {
        const response = isArchivedView
          ? await fetchArchivedShoppingLists(currentUser.id)
          : await fetchShoppingLists(currentUser.id);

        const lists = response.data.shoppingLists.map((list) => ({
          id: list._id,
          title: list.title,
          isArchived: list.isArchived,
        }));
        setShoppingLists(lists);
      } catch (error) {
        console.error("Failed to fetch shopping lists", error);
      }
    };

    loadShoppingLists();
  }, [currentUser, isArchivedView]);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const response = await addShoppingList(newListTitle, currentUser.id);
      setShoppingLists([
        ...shoppingLists,
        { id: response.data.shoppingListId, title: newListTitle, isArchived: false },
      ]);
      setNewListTitle("");
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add shopping list", error);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await deleteShoppingList(listToDelete.id, currentUser.id);
      setShoppingLists(
        shoppingLists.filter((list) => list.id !== listToDelete.id)
      );
      setListToDelete(null);
    } catch (error) {
      console.error("Failed to delete shopping list", error);
    }
  };

  const handleToggleArchive = async (listId, isArchived) => {
    try {
      await toggleArchiveStatus(listId, isArchived, currentUser.id);
      setShoppingLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId ? { ...list, isArchived } : list
        )
      );
    } catch (error) {
      console.error("Failed to toggle archive status", error);
    }
  };

  if (!currentUser) {
    return <div>{translations[language].pleaseSelectUser}</div>;
  }

  return (
    <div className="shopping-lists-page">
      <h1 className="title">
        {isArchivedView
          ? translations[language].archivedLists
          : translations[language].shoppingListsTitle}
      </h1>

      <button
        className="toggle-view-button"
        onClick={() => setIsArchivedView(!isArchivedView)}
      >
        {isArchivedView
          ? translations[language].viewActiveLists
          : translations[language].archivedLists}
      </button>

      <button className="add-button" onClick={() => setModalOpen(true)}>
        {translations[language].addNewList}
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{translations[language].addNewList}</h2>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder={translations[language].enterListTitle}
              className="input"
            />
            <div className="modal-actions">
              <button onClick={handleAddList} className="confirm-button">
                {translations[language].addItem}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="cancel-button"
              >
                {translations[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shopping-lists-container">
        {shoppingLists.map((list) => (
          <div key={list.id} className="shopping-list-card">
            <Link
              to={`/shopping-lists/${list.id}`}
              state={{ title: list.title }}
              className="shopping-list-title"
            >
              {list.title}
            </Link>
            <button
              className="archive-button"
              onClick={() => handleToggleArchive(list.id, !list.isArchived)}
            >
              {list.isArchived
                ? translations[language].unarchive
                : translations[language].archive}
            </button>
            {!isArchivedView && (
              <button
                className="delete-button"
                onClick={() => setListToDelete(list)}
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {listToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>{translations[language].confirmDeletion}</h2>
            <p>
              {translations[language].confirmDeletionMessage.replace(
                "{listTitle}",
                listToDelete.title
              )}
            </p>
            <div className="modal-actions">
              <button onClick={handleDeleteList} className="confirm-button">
                {translations[language].yesDelete}
              </button>
              <button
                onClick={() => setListToDelete(null)}
                className="cancel-button"
              >
                {translations[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsPage;
