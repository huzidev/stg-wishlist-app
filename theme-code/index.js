import React from 'react';
import { createRoot } from "react-dom/client";
import SWPopUpDrawer from "./drawer/SWPopUpDrawer";
import Lists from "./lists/Lists";
import SWAddToWishlistButton from "./products/SWAddToWishlistButton";
import SWWishlistIcon from "./products/SWWishlistIcon";
import "./styles/form.css";
import "./styles/sidebar.css";
import "./styles/table.css";
import "./styles/view-list.css";
import "./styles/wishlist.css";
import { getLists, getProducts, getStorePlan, themeListURL, themeProductURL } from "./utils/fetch.js";

// LoggedIn Customer Id
const customerId = window.SW_Customer;
const guestId = localStorage.getItem("guestId");
const userId = !!customerId ? customerId : guestId;
// URL for fetch user's Wishlists
const HOST = `${themeListURL}/${userId}`;
const HOST_PRODUCTS = `${themeProductURL}s/${userId}`;

// Global object for user's Wishlists
let SW_CustomerList = {};
let customerProducts = [];
let customerLists = [];
let product = window.SW_ProductsArray;

async function SW_ListUpdate() {
  const data = await getLists(HOST);
  if (data) {
    const mappedData = data.map((val) => {
      return {
        id: val.id,
        title: val.title,
      };
    });
    SW_CustomerList = { lists: mappedData };
  }
}
SW_ListUpdate();

// set theme-plan in local-storage
async function getPlan() {
  const response = await getStorePlan();
  const { plan } = response;
  const currentPlan = localStorage.getItem('theme-plan');
  if (!currentPlan) {
    // Set the plan in localStorage if their is no plan
    localStorage.setItem('theme-plan', response);
  } else {
    if (parseInt(currentPlan) !== plan) {
      // update the plan in localStorage
      localStorage.setItem('theme-plan', plan);
    }
  }
}
getPlan();

const rootContainer = document.getElementById("sw-wishlist-lists");
if (rootContainer) {
  const root = createRoot(rootContainer);
  root.render(<Lists SW_ListUpdate={SW_ListUpdate} HOST={HOST} />);
}

// Render Side-Bar drawer
const sidebarContainer = document.getElementById("sidebar-drawer");
if (sidebarContainer) {
  const root = createRoot(sidebarContainer);
  root.render(<SWPopUpDrawer />);
}

// Render Wishlist button for product
const buttonContainer = document.getElementById("wishlist-button");
if (buttonContainer) {
  const productId = buttonContainer.getAttribute("productId");
  const productHandle = buttonContainer.getAttribute("productHandle");
  const root = createRoot(buttonContainer);
  root.render(
    <SWAddToWishlistButton
      GET_LIST={HOST}
      productId={productId}
      productHandle={productHandle}
    />,
  );
}

// append Heart Icon on product card
async function appendNode(productWrapper) {
  const products = await getProducts(HOST_PRODUCTS);
  productWrapper.forEach((wrapper, index) => {
    const { id, handle } = product[index];
    const isProductPresent = products.find((product) => product.shopify_id === id);
    const heartIconComponent = document.createElement("div");
    wrapper.appendChild(heartIconComponent);
    const root = createRoot(heartIconComponent);
    root.render(
      <SWWishlistIcon
        productId={id}
        productHandle={handle}
        GET_LIST={HOST}
        isProductAdded={isProductPresent}
      />,
    );
  });
}

const gridProducts = document.querySelectorAll(
  `.${window.SW_Product_Grid_Class}`,
);
if (!!gridProducts.length) {
  appendNode(gridProducts);
} else {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // nodeType === 1 for only tags because nodeType for tags like <div></div> is 1 and not for text which have nodeType of 3
          if (node.nodeType === 1) {
            // select the assigned global class from page content
            const productCardWrappers = node.querySelectorAll(
              `.${window.SW_Product_Grid_Class}`,
            );
            if (!!productCardWrappers.length) {
              appendNode(productCardWrappers);
            }
          }
        });
      }
    });
  });
  // if content changes later then append the icon
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
