import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, DataTable, Page, Text } from "@shopify/polaris";
import React from "react";
import { authenticate } from "~/shopify.server";
import Shop from "../models/db/Shop.server";
import { months } from "../utils/data";

export async function loader({ request, params }) {
  const { month } = params;
  const { session, admin } = await authenticate.admin(request);
  const shop = new Shop(session.shop, admin.graphql);
  const selectedMonth = months.find((m) => m.label.toLowerCase() === month);
  const date = new Date();
  const y = date.getFullYear();
  const m = selectedMonth.value;
  const startDate = new Date(y, m - 1, 0);
  const endDate = new Date(y, m, 0);
  const products = await shop.getProductsByMonth(startDate, endDate);
  return json({
    products,
    selectedMonth,
  });
}

export default function AllProducts() {
  const { products, selectedMonth } = useLoaderData();
  let rows;
  const { message, data, type } = products
  const isProductsFetced = type === "success";
  if (isProductsFetced) {
    rows = data.map((product, index) => {
        const { handle, shopify_url } = product;
        const product_url = `http://${shopify_url}/products/${handle}`;
        return [
          index + 1,
          <span style={{ cursor:' pointer', textDecoration: 'underLine' }} onClick={() => open(product_url, "_blank")}>{handle}</span>,
        ];
      });
  }
  return (
    <Page
      backAction={{ url: "/app" }}
      title={`Products added in the month of ${selectedMonth.label}`}
      compactTitle
      fullWidth
    >
      <Card>
        {!isProductsFetced ? (
          <Text variant="headingLg" as="h2">
            {message + selectedMonth.label}
          </Text>
        ) : (
          <DataTable
            columnContentTypes={["numeric", "text"]}
            headings={["Sno", "Title"]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
}
