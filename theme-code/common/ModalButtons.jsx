import React from 'react';

export default function ModalButtons({
  type,
  title,
  listTitle,
  setListTitle,
  primaryButtonAction,
  primaryButtonText,
  secondaryButtonAction,
}) {
  const isListEmpty = type === "empty-lists";
  return (
    <div>
      <h4>{title}</h4>
      {isListEmpty && (
        <input
          className='title-input-field'
          name="formData"
          value={listTitle}
          type="text"
          placeholder="Wishlist title"
          onChange={(e) => setListTitle(e.target.value)}
        />
      )}
      <div className="modal-button-conainer">
        <button
          style={{ cursor: `${isListEmpty && (!listTitle.length ? 'not-allowed' : '')} ` }}
          disabled={isListEmpty ? !listTitle.length : false}
          className="wishlist-button"
          onClick={primaryButtonAction}
        >
          {primaryButtonText}
        </button>
        <button className="cancel-button" onClick={secondaryButtonAction}>
          Cancel
        </button>
      </div>
    </div>
  );
}
