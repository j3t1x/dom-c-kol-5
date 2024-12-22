import React, { useState } from 'react';

function ItemList({ items, addItem, removeItem }) {
  const [newItem, setNewItem] = useState("");

  return (
    <div>
      <h2>Položky</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span style={{ textDecoration: item.resolved ? "line-through" : "none" }}>
              {item.name}
            </span>
            <button onClick={() => removeItem(item.id)}>Odebrat</button>
            <button onClick={() => (item.resolved = !item.resolved)}>
              {item.resolved ? "Nevyřešeno" : "Vyřešeno"}
            </button>
          </li>
        ))}
      </ul>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Přidat položku" />
      <button onClick={() => { addItem(newItem); setNewItem(""); }}>Přidat položku</button>
    </div>
  );
}

export default ItemList;
