import React from "react";


export default function Modal({
  title,
  message,
  primaryBtnText,
  primaryBtnAction,
}) {
  function closeModal() {
    document.getElementById("my-modal").hide();
  }

  return (
    <ui-modal id="my-modal">
      <p className="modal-msg">
        {message}
      </p>
      {/* <Text as="p" variant="headingLg">
      </Text> */}
      <ui-title-bar title={title}>
        <button onClick={closeModal}>Cancel</button>
        <button onClick={primaryBtnAction} variant="primary">
          {primaryBtnText}
        </button>
      </ui-title-bar>
    </ui-modal>
  );
}
