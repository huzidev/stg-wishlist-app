import React, { useState } from "react";
import AddList from "./AddList.jsx";
import GetLists from './GetLists.jsx';

export default function Lists({ SW_ListUpdate, HOST }) {
  const [listForm, setListForm] = useState(false);

  return (
    <div>
      <h1>{listForm ? "Add Wishlist" : "Wishlists"}</h1>
      {!listForm ? (
        <>
          <GetLists HOST={HOST} SW_ListUpdate={SW_ListUpdate} />
          <button className="add-btn" onClick={() => setListForm(true)}>
            Add Wishlist
          </button>
        </>
      ) : (
        <>
          <div className="back-btn" onClick={() => setListForm(false)}>
            <p>Go back</p>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 1024 1024"
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000000"
                d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z"
              />
              <path
                fill="#000000"
                d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"
              />
            </svg>
          </div>
          <AddList
            SW_ListUpdate={SW_ListUpdate}
            setListForm={setListForm}
            HOST={HOST}
          />
        </>
      )}
    </div>
  );
}
