import React, { useEffect, useState } from "react";
import { getLists, themeListURL, updateMethod } from "../utils/fetch";
import UpdateLists from "./UpdateLists";

export default function GetLists({ HOST, SW_ListUpdate }) {
  const [lists, setLists] = useState([]);
  const customerId = window.SW_Customer;
  const guestId = localStorage.getItem("guestId");
  const HOST_UPDATE = `${themeListURL}/${guestId}`;
  
  async function updateRequest(config) {
    const list = await updateMethod(HOST_UPDATE, "PUT", config);
    console.log("SW updaated list data from the updateRequest method", list);
    setLists((prevLists) => [...prevLists, list.data]);
    localStorage.removeItem("guestId");
  }

  useEffect(() => {
    // when customer loggedIn and if their is guestId hence assign that guest's List to the loggedIn customer
    if (customerId && guestId) {
      const updateListConifg = {
        method: "update-list",
        customerId,
      };
      updateRequest(updateListConifg);
    }
  }, [customerId]);

  async function getAllLists() {
    const response = await getLists(HOST);
    if (response) {
      setLists(response);
    }
  }
  useEffect(() => {
    getAllLists();
  }, []);

  return (
    <div>
      {!lists.length ? (
        <div>
          <p>No wishlist created yet.</p>
        </div>
      ) : (
        <UpdateLists
          lists={lists}
          SW_ListUpdate={SW_ListUpdate}
          setLists={setLists}
          HOST={HOST}
          updateMethod={updateMethod}
          customerId={customerId}
        />
      )}
    </div>
  );
}
