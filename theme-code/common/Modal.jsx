import React, { useState } from "react";
import { updateMethod } from "../utils/fetch";
import ModalButtons from "./ModalButtons";

export default function Modal({
  shopURL,
  customerId,
  selectedList,
  lists,
  setSelectedList,
  updateProduct,
  Add_Product_HOST,
  Add_List_HOST,
  addProductConfig,
  productHandle,
  setModal,
  callBack,
  isBasicPlan,
}) {
  function handleOnChange(id) {
    const list = lists.find((list) => list.id === parseInt(id));
    setSelectedList(list);
  }

  console.log("SW isBasicPlan modal", isBasicPlan);
  const guestTitle = "Do you wanna add this product to wishlist as guest";
  const emptyListsTitle = "Seems like you haven't created any wishlist";
  const basicPlanTitle = "Kindly Signin first to add products in wishlist";
  const primaryBtnText = isBasicPlan ? "Sign in" : "Add To Wishlist";
  const [listTitle, setListTitle] = useState("");

  async function handlePrimaryBtnAction(HOST, config) {
    if (isBasicPlan) {
      window.location.href = "/account/login";
    } else {
      updateProduct(HOST, "POST", config);
    }
  }

  async function createAndAdd(title) {
    const config = {
      title,
      shop_url: shopURL,
      method: "add-list",
    };
    const response = await updateMethod(Add_List_HOST, "POST", config);
    if (response.data) {
      const { id } = response.data;
      const updatedAddProductConfig = {
        listId: id,
        handle: productHandle,
        shop_url: shopURL,
        method: "add-product",
      };
      await updateProduct(Add_Product_HOST, "POST", updatedAddProductConfig);
    }
  }

  const emptyListsProps = lists.length
    ? {}
    : {
        listTitle: listTitle,
        setListTitle: setListTitle,
      };

  return (
    <div className="modal-container">
      <div className="modal-content">
        {callBack ? (
          <h2>
            Product Added To{" "}
            {!!customerId
              ? ` ${selectedList?.title ?? listTitle}`
              : "Guest List"}{" "}
            Successfully
          </h2>
        ) : (
          <>
            {/* if not customerId hence guest and if store's plan is basic then not allow guest list feature */}
            {!customerId ? (
              <ModalButtons
                type="guest"
                title={isBasicPlan ? basicPlanTitle : guestTitle}
                primaryButtonAction={() =>
                  handlePrimaryBtnAction(Add_Product_HOST, addProductConfig)
                }
                primaryButtonText={primaryBtnText}
                secondaryButtonAction={() => setModal(false)}
              />
            ) : !lists.length ? (
              <ModalButtons
                type="empty-lists"
                title={emptyListsTitle}
                {...emptyListsProps}
                primaryButtonAction={() => createAndAdd(listTitle)}
                primaryButtonText="Create & Add"
                secondaryButtonAction={() => setModal(false)}
              />
            ) : (
              <>
                <h2>Select a Wishlist</h2>
                <select
                  value={selectedList ? selectedList.id : ""}
                  onChange={(e) => handleOnChange(e.target.value)}
                >
                  {lists.map((list) => {
                    const { id, title } = list;
                    return (
                      <option key={id} value={id}>
                        {title}
                      </option>
                    );
                  })}
                </select>
                <ModalButtons
                  type="add-list"
                  primaryButtonAction={() =>
                    handlePrimaryBtnAction(Add_Product_HOST, addProductConfig)
                  }
                  primaryButtonText="Add to Wishlist"
                  secondaryButtonAction={() => setModal(false)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
