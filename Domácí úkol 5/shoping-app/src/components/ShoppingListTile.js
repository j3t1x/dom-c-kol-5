import React from 'react';
import { Link } from 'react-router-dom';

const ShoppingListTile = ({ list, isOwner, onDelete }) => {
  return (
    <div className="shopping-list-tile">
      <h2>
        {/* Use Link to navigate to the detail page */}
        <Link to={`/shopping-lists/${list.id}`}>{list.title}</Link>
      </h2>
      {isOwner && <button onClick={onDelete}>Delete</button>}
    </div>
  );
};

export default ShoppingListTile;
