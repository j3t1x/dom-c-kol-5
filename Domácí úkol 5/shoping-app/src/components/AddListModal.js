import React, { useState } from 'react';

const AddListModal = ({ isOpen, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      const newList = { id: Date.now(), title, ownerId: 1 }; 
      onSubmit(newList);
      setTitle('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Add New Shopping List</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="List Title" />
      <button onClick={handleSubmit}>Add</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AddListModal;
