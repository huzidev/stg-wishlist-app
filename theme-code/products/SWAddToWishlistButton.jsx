import React from "react";
import ReactDOM from "react-dom";
import Modal from "../common/Modal.jsx";
import useButtonHook from "../hooks/useButtonHook.jsx";

export default function SWAddToWishlistButton({
  productId,
  GET_LIST,
  productHandle,
}) {
  const type = "product";
  const {
    updateProduct,
    handleGuestProduct,
    lists,
    HOST,
    modal,
    setModal,
    callBack,
    isProductPresent,
    addProductConfig,
    removeProductConfig,
    loading,
    guestProduct,
    customerId,
    setSelectedList,
    selectedList,
    guestId,
    shop,
    isBasicPlan,
  } = useButtonHook(productHandle, GET_LIST, productId, type);

  console.log("SW isProductPresent", isProductPresent);

  return (
    <>
      <div className="wishlist-button__content">
        {!loading && (
          <button
            className="wishlist-button-main"
            // if product is already in list then remove that product else show modal which will take details for list in which product had to be added
            onClick={() => {
              if (!isProductPresent) {
                if ((!customerId && !guestId) && !isBasicPlan) {
                  handleGuestProduct();
                } else if (customerId || guestId || isBasicPlan) {
                  setModal(true);
                }
              } else {
                updateProduct(HOST, "DELETE", removeProductConfig);
              }
            }}
          >
            {(isProductPresent ? "Remove From " : "Add to ") + "Wishlist"}
          </button>
        )}
      </div>
      {modal &&
        !loading &&
        ReactDOM.createPortal(
          <Modal
            shopURL={shop}
            customerId={customerId}
            selectedList={selectedList}
            lists={lists}
            setSelectedList={setSelectedList}
            Add_Product_HOST={HOST}
            Add_List_HOST={GET_LIST}
            isBasicPlan={isBasicPlan}
            addProductConfig={addProductConfig}
            setModal={setModal}
            updateProduct={updateProduct}
            productHandle={productHandle}
            callBack={callBack}
            guestProduct={guestProduct}
          />,
          document.body,
        )}
    </>
  );
}
