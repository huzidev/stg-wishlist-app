import React, { useState } from "react";
import ViewList from "./ViewList";

export default function UpdateLists({
  lists,
  HOST,
  setLists,
  SW_ListUpdate,
  updateMethod,
  customerId,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isList, setIsList] = useState(false);
  const [listData, setListData] = useState({});

  async function updateList(HOST, method, config) {
    const response = await updateMethod(HOST, method, config);
    if (response.type === "List-Updated") {
      const updatedListID = response.data.id;
      const currentIndex = lists.findIndex((list) => list.id === updatedListID);
      if (currentIndex || currentIndex === 0) {
        const updatedLists = [...lists];
        updatedLists[currentIndex] = response.data;
        setLists(updatedLists);
        setEditingId(null);
        SW_ListUpdate();
      }
    } else {
      const filteredList = lists.filter((list) => list.id !== response.data.id);
      setLists(filteredList);
      SW_ListUpdate();
    }
  }

  function editField(id, title) {
    setEditingId(id);
    setEditValue(title);
  }

  function handleList(list) {
    setListData(list);
    setIsList(true);
  }

  const editConfig = {
    title: editValue,
    method: "edit-list",
  };

  return (
    <>
      {isList ? (
        <ViewList customerId={customerId} setIsList={setIsList} listData={listData} />
      ) : (
        <div className="table__content">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Products Count</th>
                <th>Shop</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => {
                const { id, title, shopify_url, products } = list;
                const config = {
                  id,
                  method: "delete-list"
                }
                const isEditing = editingId === id;
                return (
                  <tr key={id}>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        <span onClick={() => handleList(list)}>{title}</span>
                      )}
                    </td>
                    <td>{products?.length}</td>
                    <td>{shopify_url}</td>
                    <td>
                      <div className="table-button-container">
                        {isEditing ? (
                          <button
                            onClick={() =>
                              updateList(HOST, "PUT", { ...editConfig, id })
                            }
                          >
                            Done
                          </button>
                        ) : (
                          <button onClick={() => editField(id, title)}>
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() =>
                            isEditing
                              ? setEditingId(null)
                              : updateList(HOST, "DELETE", config)
                          }
                        >
                          {isEditing ? "Cancel" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
