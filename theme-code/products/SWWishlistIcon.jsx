import React from "react";
import ReactDOM from "react-dom";
import Modal from "../common/Modal.jsx";
import useButtonHook from "../hooks/useButtonHook.jsx";

export default function SWWishlistIcon({
  productId,
  productHandle,
  GET_LIST,
  isProductAdded,
}) {
  const type = "icon";
  const {
    updateProduct,
    handleGuestProduct,
    lists,
    HOST,
    modal,
    setModal,
    callBack,
    addProductConfig,
    removeProductConfig,
    guestProduct,
    customerId,
    setSelectedList,
    selectedList,
    isProductPresent,
    shop,
    isBasicPlan,
  } = useButtonHook(productHandle, GET_LIST, productId, type, isProductAdded);

  console.log("SW is baskic plan in icons", isBasicPlan);

  return (
    <>
      <span
        className="wishlist-icon"
        id={productId}
        handle={productHandle}
        onClick={() => {
          const storedGuestId = localStorage.getItem("guestId");
          if (!isProductPresent) {
            if ((!customerId && !storedGuestId) && !isBasicPlan) {
              handleGuestProduct();
            }
            if (customerId || storedGuestId || isBasicPlan) {
              setModal(true);
            }
          } else {
            updateProduct(HOST, "DELETE", removeProductConfig);
          }
        }}
      >
        {isProductPresent ? (
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            xmlnsrdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnscc="http://creativecommons.org/ns#"
            xmlnsdc="http://purl.org/dc/elements/1.1/"
          >
            <g transform="translate(0 -1028.4)">
              <path
                d="m7 1031.4c-1.5355 0-3.0784 0.5-4.25 1.7-2.3431 2.4-2.2788 6.1 0 8.5l9.25 9.8 9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-0.75 0.8-0.75-0.8c-1.172-1.2-2.7145-1.7-4.25-1.7z"
                fill="#e74c3c"
              />
            </g>
          </svg>
        ) : (
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <path d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" />
          </svg>
        )}
      </span>
      {modal &&
        ReactDOM.createPortal(
          <Modal
            shopURL={shop}
            customerId={customerId}
            selectedList={selectedList}
            lists={lists}
            setSelectedList={setSelectedList}
            Add_Product_HOST={HOST}
            Add_List_HOST={GET_LIST}
            addProductConfig={addProductConfig}
            setModal={setModal}
            updateProduct={updateProduct}
            callBack={callBack}
            productHandle={productHandle}
            guestProduct={guestProduct}
            isBasicPlan={isBasicPlan}
          />,
          document.body,
        )}
    </>
  );
}
