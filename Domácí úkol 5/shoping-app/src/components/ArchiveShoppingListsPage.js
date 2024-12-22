import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchArchivedShoppingLists } from "../api";
import { useUser } from "./UserSwitcher";
import "./ShoppingListsPage.css";

const ArchiveShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const { currentUser } = useUser();

  useEffect(() => {
    const loadArchivedShoppingLists = async () => {
      if (!currentUser) return;

      try {
        const response = await fetchArchivedShoppingLists(currentUser.id);
        const lists = response.data.shoppingLists.map((list) => ({
          id: list._id,
          title: list.title,
        }));
        setShoppingLists(lists);
      } catch (error) {
        console.error("Failed to fetch archived shopping lists", error);
      }
    };

    loadArchivedShoppingLists();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please select a user to view archived shopping lists.</div>;
  }

  return (
    <div className="shopping-lists-page">
      <h1 className="title">Archive Shopping Lists</h1>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchiveShoppingListsPage;
