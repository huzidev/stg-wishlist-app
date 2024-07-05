import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { Button, Card, DataTable, Page, Spinner, Text } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import Customer from "~/models/Customers.server";
import Shop from "~/models/db/Shop.server";
import { authenticate } from "~/shopify.server";
import Modal from "../components/common/Modal";
import Plan from "../models/Billing.server";

export async function loader({ request, params }) {
  const { session, admin } = await authenticate.admin(request);
  const shop = new Shop(session.shop, admin.graphql);
  const customers = new Customer(session.shop, admin.graphql);
  const { userId } = params;
  const customerData = await customers.getCustomer(userId);
  const plan = new Plan();
  const wishLists = await shop.getCustomerLists(userId);
  const currentPlan = await plan.getPlan();
  let initialProducts;
  if (wishLists) {
    initialProducts = await shop.getListProducts(wishLists[0].id);
  }
  return json({
    wishLists,
    customerData,
    initialProducts,
    userId,
    currentPlan,
  });
}

export async function action({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const shop = new Shop(session.shop, admin.graphql);
  const { action, listId } = await request.json();
  let productsList;
  if (action === "fetch-products") {
    productsList = await shop.getListProducts(listId);
  }
  return json({
    productsList,
  });
}

export default function UserList() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { wishLists, initialProducts, userId, customerData, currentPlan } =
    useLoaderData();
  const actiondata = useActionData();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState({
    index: 0,
    listId: "",
    title: wishLists[0].title,
  });

  useEffect(() => {
    if (wishLists) {
      setLists(wishLists);
    }
  }, [wishLists]);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
    if (actiondata) {
      const { productsList } = actiondata;
      setProducts(productsList);
    }
    setLoading(false);
  }, [initialProducts, actiondata]);

  function getProduct(list) {
    setLoading(true);
    setSelectedList(list);
    submit(
      {
        listId: list.listId,
        action: "fetch-products",
      },
      { replace: true, method: "POST", encType: "application/json" },
    );
  }

  const { type, discounts } = currentPlan;
  const isBasicPlan = type === "Basic";
  const isDiscountLimitReached = discounts === 20;

  function handleDiscountNavigate(url) {
    if (isDiscountLimitReached || isBasicPlan) {
      document.getElementById("my-modal").show();
    } else {
      navigate(url);
    }
  }

  const rows =
    products &&
    products.map((product, index) => {
      const { handle, shopify_url, clicks, id, discount } = product;
      const product_url = `https://${shopify_url}/products/${handle}`;
      const url = `/app/discount/${userId}/${id}`;
      return [
        index + 1,
        <span
          style={{ cursor: " pointer", textDecoration: "underLine" }}
          onClick={() => open(product_url, "_blank")}
        >
          {handle}
        </span>,
        <span>{clicks}</span>,
        <span>{discount}%</span>,
        <Button variant="plain" onClick={() => handleDiscountNavigate(url)}>
          {discount === 0 ? "Give" : "Edit"} Discount
        </Button>
      ].filter(Boolean);
      // filter out the false value if currentPlan is basic then no need to render the Link Button
    });

  const actionGroups = [
    {
      title: `${selectedList.title}`,
      actions: lists.map((list, i) => {
        const { title, id } = list;
        const currentList = {
          i,
          listId: id,
          title,
        };
        return {
          content: title,
          onAction: () => getProduct(currentList),
        };
      }),
    },
  ];

  const columnTypes = ["numeric", "text", "numeric", "numeric", "text"];
  const tableHeadings = ["Sno", "Title", "Clicks", "Discount", "Action"];

  return (
    <Page
      backAction={{ url: "/app/lists" }}
      title={`${customerData?.data.firstName}'s Wishlists`}
      subtitle={`Products of ${selectedList.title}`}
      compactTitle
      fullWidth
      actionGroups={actionGroups}
    >
      <Modal
        title="Error"
        message={`${isBasicPlan ? 'Please upgrade yours plan' : 'Discounts Limit Reached'}`}
        primaryBtnText={(isBasicPlan ? 'Change ' : 'Update ') + 'Plan'}
        primaryBtnAction={() => {
          navigate("/app/plans");
          document.getElementById("my-modal").hide();
        }}
      />
      {loading ? (
        <Card>
          <Spinner size="small" />
        </Card>
      ) : !products.length ? (
        <Card>
          <Text as="h3" variant="headingLg">
            Their is no product in current list
          </Text>
        </Card>
      ) : (
        <DataTable
          columnContentTypes={columnTypes}
          headings={tableHeadings}
          rows={rows}
        />
      )}
    </Page>
  );
}
