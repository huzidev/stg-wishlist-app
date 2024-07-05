import React from "react";
import useDrawerHook from "../hooks/useDrawerHook";
import { addToCart, themeProductURL, updateMethod } from "../utils/fetch";

export default function SWPopUpDrawer() {
  const {
    products,
    setProducts,
    setIsOpen,
    setSelectedList,
    isOpen,
    loading,
    lists,
    selectedList,
    guestId,
    customerId,
    isBasicPlan,
  } = useDrawerHook();
  const HOST_URL = `${themeProductURL}/${customerId}/`;

  async function removeProduct(id) {
    const config = {
      id,
      method: "remove-product",
    };
    const response = await updateMethod(HOST_URL + id, "DELETE", config);
    if (response && response.data) {
      setProducts(() =>
        products.filter((product) => parseInt(product.id) !== id),
      );
    }
  }

  async function handleProductClicked(url, id) {
    const config = {
      id,
      method: "add-count",
    };
    await updateMethod(HOST_URL + id, "PUT", config);
    open(url, "_blank");
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h5>Wishlist Drawer</h5>
          <span onClick={() => setIsOpen(false)}>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6L18 18" stroke="#000000" strokeLinecap="round" />
              <path
                d="M18 6L6.00001 18"
                stroke="#000000"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <div className="lists-drop-down">
          {lists.length > 1 && (
            <select
              value={selectedList?.id}
              onChange={(e) => {
                const selectedListId = e.target.value;
                const list = lists.find(
                  (list) => list.id === parseInt(selectedListId),
                );
                setSelectedList(list);
              }}
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
          )}
        </div>
        <div>
          {(!!customerId || !!guestId) &&
            (loading ? (
              <p className="sidebar-message">Please Wait</p>
            ) : !lists.length ? (
              <p className="sidebar-message">
                You haven't created any wishlist yet.
              </p>
            ) : !products.length ? (
              <p className="sidebar-message">
                {customerId && !guestId
                  ? `You haven't added any product into ${selectedList?.title} yet`
                  : `You haven't added any product as a Guest yet`}
              </p>
            ) : (
              <>
                {!!guestId && !customerId && (
                  <>
                    <h3 className="sidebar-message">
                      You are adding products As <b>Guest</b>
                    </h3>
                    <p className="sidebar-message">
                      You will get the same products in wishlist when you{" "}
                      <span
                        className="signin-button"
                        onClick={() =>
                          (window.location.href = "/account/login")
                        }
                      >
                        SignIn
                      </span>
                    </p>
                  </>
                )}
                {products.map((product) => {
                  const {
                    id,
                    handle,
                    imageSrc,
                    shopify_url,
                    variants,
                    discount,
                    price,
                    title,
                  } = product;
                  const config = {
                    id: variants && variants[0].id,
                    quantity: 1,
                  };
                  const productURL = `https://${shopify_url}/products/${handle}`;
                  const discountedPrice = price - (price * discount) / 100;
                  return (
                    <div
                      onClick={() => handleProductClicked(productURL, id)}
                      className="side-bar-product-card"
                      key={id}
                    >
                      <div className="side-bar-img-wrapper">
                        <img src={imageSrc ?? ""} alt="Product-img" />
                      </div>
                      <div className="side-bar-product-details">
                        <div>
                          <div>
                            {discount > 0 ? (
                              <>
                                <del>{price}</del>{" "}
                                <span>{discountedPrice}</span>
                              </>
                            ) : (
                              <p>{price ?? "00.00"}</p>
                            )}
                          </div>
                          <p className="product-title">{title}</p>
                          {price && (
                            <div className="add-to-cart-button">
                              {/* stopPropagation function to stop the parent function from initiating when child function is called */}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(shopify_url, config);
                                }}
                              >
                                Add To Cart
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProduct(id);
                            }}
                          >
                            <svg
                              width="20px"
                              height="20px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ scale: "1.3" }}
                            >
                              <path
                                d="M5.73708 6.54391V18.9857C5.73708 19.7449 6.35257 20.3604 7.11182 20.3604H16.8893C17.6485 20.3604 18.264 19.7449 18.264 18.9857V6.54391M2.90906 6.54391H21.0909"
                                stroke="#1C1C1C"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                              <path
                                d="M8 6V4.41421C8 3.63317 8.63317 3 9.41421 3H14.5858C15.3668 3 16 3.63317 16 4.41421V6"
                                stroke="#1C1C1C"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ))}
          {!customerId && !guestId && (
            <p className="sidebar-message">
              You are Not{" "}
              <span
                className="signin-button"
                onClick={() => (window.location.href = "/account/login")}
              >
                SignedIn
              </span>{" "}
              {isBasicPlan ? (
                "Kindly Signin first to add products in wishlist"
              ) : (
                <>
                  But you can still add the products in wishlist as a{" "}
                  <b>Guest</b>
                </>
              )}
            </p>
          )}
        </div>
      </div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`overlay ${isOpen ? "open" : ""}`}
      ></div>
      <span onClick={() => setIsOpen(!isOpen)} className="heart-icon">
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
      </span>
    </>
  );
}
