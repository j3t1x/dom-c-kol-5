import React from 'react';

const DeleteConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this shopping list?</p>
      <button onClick={onConfirm}>Yes, Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteConfirmationDialog;
