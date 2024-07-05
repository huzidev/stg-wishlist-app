import React, { useEffect, useState } from "react";
import {
  addToCart,
  fetchProductsImages,
  getProducts,
  themeProductURL,
  updateMethod
} from "../utils/fetch";

export default function ViewList({ customerId, listData, setIsList }) {
  const [products, setProducts] = useState([]);
  const [productsFetched, setProductsFetched] = useState(false);
  const { id, title } = listData;

  async function fetchData() {
    const data = await getProducts(`${themeProductURL}s/${customerId}/${id}`);
    if (!!data.length) {
      setProducts(data);
    } else {
      setProductsFetched(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchProductsData() {
    const updatedProducts = await fetchProductsImages(products);
    if (!!updatedProducts.length) {
      setProducts(updatedProducts);
      setProductsFetched(true);
    }
  }
  
  useEffect(() => {
    if (!!products.length && !productsFetched) {
      fetchProductsData();
    }
  }, [products, productsFetched]);

  async function handleProductClicked(url, id) {
    const config = {
      id,
      method: "add-count",
    };
    await updateMethod(`${themeProductURL}/${customerId}/${id}`, "PUT", config);
    open(url, "_blank");
  }

  return (
    <div className="wishlist-products">
      <div className="back-btn" onClick={() => setIsList(false)}>
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
      <h1>Viewing {title}</h1>
      <div className="product-grid">
        {!productsFetched ? (
          <h5>Please Wait</h5>
        ) : !products.length ? (
          <h4>The {title} is empty</h4>
        ) : (
          products.map((product) => {
            const { id, handle, imageSrc, product_url, shopify_url, variants } =
              product;
            const config = {
              id: variants[0].id,
              quantity: 1,
            };
            return (
              <div className="product-card" key={id}>
                <img src={imageSrc ?? ""} alt="Product-img" />
                <h2>{handle}</h2>
                <div className="wishlist-button-container">
                  <button
                    className="product-button"
                    onClick={() => handleProductClicked(product_url, id)}
                  >
                    View Product
                  </button>
                  <button
                    onClick={() => addToCart(shopify_url, config)}
                    className="product-button"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
