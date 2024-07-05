import React, { useState } from "react";
import { updateMethod } from "../utils/fetch";

export default function AddList({ HOST, SW_ListUpdate, setListForm }) {
  const [listTitle, setListTitle] = useState("");
  const { shop } = Shopify;

  async function addList(title) {
    const config = {
      title,
      shop_url: shop,
      method: "add-list",
    };
    const response = await updateMethod(HOST, "POST", config);
    if (response.data) {
      SW_ListUpdate();
      setListForm(false);
    }
  }

  return (
    <div className="form-container">
      <input
        name="formData"
        value={listTitle}
        type="text"
        placeholder="Wishlist title"
        onChange={(e) => setListTitle(e.target.value)}
      />
      <button
        disabled={!listTitle ? true : false}
        onClick={() => addList(listTitle)}
      >
        Add Wishlist
      </button>
    </div>
  );
}
