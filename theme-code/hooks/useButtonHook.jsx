import { useEffect, useState } from "react";
import {
  getLists,
  getProduct,
  themeListURL,
  themeProductURL,
  updateMethod
} from "../utils/fetch.js";

export default function useButtonHook(
  productHandle,
  GET_LIST,
  productId,
  type,
  isProductAdded,
) {
  const customerId = window.SW_Customer;
  const guestId = localStorage.getItem("guestId");
  const { shop } = Shopify;
  // config for the product to be added into wishlist
  const [addProductConfig, setAddProductConfig] = useState({});
  // config for the product to be removed from wishlist
  const [removeProductConfig, setRemoveProductConfig] = useState({});
  // loggedIn user's lists
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  // pre-added product
  const [isProductPresent, setIsProductPresent] = useState(false);
  const [modal, setModal] = useState(false);
  const [callBack, setCallBack] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  // pre-added product's id
  const [addedProductId, setAddedProductId] = useState("");
  // const GUEST_HOST = `${themeProductURL}s/${guestId}/${productId}`;
  const HOST = `${themeProductURL}/${!!customerId ? customerId : guestId}/${productId}`;
  const isIcon = type === "icon";
  const isBasicPlan = localStorage.getItem("theme-plan") === "1";

  async function fetchLists() {
    const listsData = await getLists(GET_LIST);
    setLoading(false);
    if (listsData) {
      setLists(listsData);
      setSelectedList(listsData[0]);
    }
  }

  useEffect(() => {
    fetchLists();
  }, [customerId]);

  async function getProductData() {
    const res = await getProduct(HOST);
    const { productData } = res;
    if (productData?.id) {
      setIsProductPresent(true);
      setAddedProductId(productData?.id);
    }
  }
  // fetch productData to check if product is already in wishlist
  useEffect(() => {
    // if isIcon page then no need to fetch product data
    if (!isIcon) {
      getProductData();
    } else {
      if (!!isProductAdded) {
        setIsProductPresent(true);
        setAddedProductId(isProductAdded?.id);
      }
    }
  }, []);

  async function handleProductConfig(id, method) {
    if (method === "add-product") {
      setAddProductConfig({
        listId: id,
        handle: productHandle,
        shop_url: shop,
        method,
      });
    } else {
      setRemoveProductConfig({
        id,
        method,
      });
    }
  }

  useEffect(() => {
    if (selectedList) {
      handleProductConfig(selectedList.id, "add-product");
    }
    if (isProductPresent) {
      handleProductConfig(addedProductId, "remove-product");
    }
  }, [selectedList, isProductPresent]);

  async function updateProduct(HOST, method, config) {
    const response = await updateMethod(HOST, method, config);
    if (response.type === "product-added") {
      // setCallback to true to show added to wishlist message in modal
      setCallBack(true);
      setTimeout(() => {
        setCallBack(false);
        setModal(false);
        setIsProductPresent(true);
        setAddedProductId(response.data?.id);
      }, 3000);
    } else {
      setIsProductPresent(false);
    }
  }

  // FOR GUEST
  async function getGuestList() {
    const HOST = `${themeListURL}/${guestId}`;
    const guestList = await getLists(HOST);
    if (guestList) {
      await handleProductConfig(guestList[0].id, "add-product");
    }
  }

  useEffect(() => {
    if (guestId) {
      getGuestList();
    }
  }, [guestId]);

  async function addGuestList(id) {
    const HOST = `${themeListURL}/${id}`;
    const config = {
      title: id + "_list",
      shop_url: shop,
      method: "add-list",
    };
    const response = await updateMethod(HOST, "POST", config);
    return response.data;
  }

  async function handleGuestProduct() {
    // if their is no guesId in localStorage then create and save one in localStorage
    setModal(true);
    const id = "guest" + Date.now();
    localStorage.setItem("guestId", id);
    const res = await addGuestList(id);
    await handleProductConfig(res.id, "add-product");
  }
  
  return {
    updateProduct,
    handleGuestProduct,
    lists,
    HOST,
    modal,
    setModal,
    callBack,
    isProductPresent,
    addProductConfig,
    productHandle,
    removeProductConfig,
    loading,
    customerId,
    selectedList,
    setSelectedList,
    guestId,
    shop,
    setCallBack,
    isBasicPlan,
  };
}
