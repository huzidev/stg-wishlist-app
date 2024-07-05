import { useEffect, useState } from "react";
import {
  fetchProductsImages,
  getLists,
  getProducts,
  themeListURL,
  themeProductURL
} from "../utils/fetch";

export default function useDrawerHook() {
  const [products, setProducts] = useState([]);
  const [lists, setLists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsFetched, setProductsFetched] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const customerId = window.SW_Customer;
  const guestId = localStorage.getItem("guestId");
  const userId = !!customerId ? customerId : guestId;
  const GET_PRODUCTS = `${themeProductURL}s/${userId}/`;
  const GET_LISTS = `${themeListURL}/${userId}`;
  const isBasicPlan = localStorage.getItem('theme-plan') === '1';
  
  // async function getPlan() {
  //   const response = await getStorePlan();
  //   console.log("SW Current store Plan", plan);
  //   const { plan } = response;
  //   localStorage.setItem('theme-plan', plan);
  // }

  // useEffect(() => {
  //   getPlan();
  // }, [])

  async function fetchData(url) {
    setLoading(true);
    const data = await getProducts(url);
    if (data) {
      setProducts(data);
      setProductsFetched(false);
    }
  }

  useEffect(() => {
    async function fetchProductsData() {
      const updatedProducts = await fetchProductsImages(products);
      if (!!updatedProducts.length) {
        setProducts(updatedProducts);
        setLoading(false);
        setProductsFetched(true);
      }
    }
    if (products.length > 0 && !productsFetched) {
      fetchProductsData();
    } else if (!products.length) {
      setLoading(false);
    }
  }, [products, productsFetched]);

  useEffect(() => {
    // fetch products according to the selected list's id
    if (selectedList) {
      const { id } = selectedList;
      fetchData(GET_PRODUCTS + id);
    }
  }, [selectedList, isOpen]);

  async function fetchLists(url) {
    const listsData = await getLists(url);
    if (!!listsData) {
      setLists(listsData);
      if (!selectedList) {
        // By defeault first list will be selected
        await fetchData(GET_PRODUCTS + listsData[0].id);
        setSelectedList(listsData[0]);
      }
    }
  }

  // Function run everytime when side-drawer is open
  useEffect(() => {
    if (isOpen) {
      fetchLists(GET_LISTS);
    }
  }, [isOpen]);

  return {
    products,
    setProducts,
    setSelectedList,
    selectedList,
    loading,
    setIsOpen,
    isOpen,
    loading,
    lists,
    guestId,
    customerId,
    isBasicPlan,
  };
}
