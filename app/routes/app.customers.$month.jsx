import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Card, DataTable, Page, Text } from "@shopify/polaris";
import React from "react";
import Customer from "~/models/Customers.server";
import Shop from "~/models/db/Shop.server";
import { authenticate } from "~/shopify.server";
import { months } from "../utils/data";

export async function loader({ request, params }) {
  const { month } = params;
  const { session, admin } = await authenticate.admin(request);
  const customers = new Customer(session.shop, admin.graphql);
  const shop = new Shop(session.shop, admin.graphql);
  const lists = await shop.getAllLists();
  let customerIdArray;
  let customersData;
  if (lists.type === "success") {
    customerIdArray = Object.keys(lists.data);
    customersData = await customers.getCustomers(customerIdArray);
  }
  const selectedMonth = months.find((m) => m.label.toLowerCase() === month);
  const date = new Date();
  const y = date.getFullYear();
  const m = selectedMonth.value;
  const startDate = new Date(y, m - 1, 0);
  const endDate = new Date(y, m, 0);
  const products = await shop.getAllProducts(startDate, endDate);
  return json({
    lists,
    customersData,
    products,
    selectedMonth,
  });
}

export default function AllCustomers() {
  const { customersData, products, selectedMonth } = useLoaderData();
  const { message, data, type } = products
  const isProductsFetched = type === "success";
  let rows;
  if (isProductsFetched) {
    rows =
      customersData &&
      customersData.map((customer, index) => {
        const { id, firstName } = customer;
        const customerId = id.replace("gid://shopify/Customer/", "");
        const arrayForCustomer = data[customerId];
        const productCount = arrayForCustomer ? arrayForCustomer : 0;
        return [
          index + 1,
          <Link to={`/app/lists/${customerId}`}>{firstName}</Link>,
          productCount,
        ];
      });
  }

  return (
    <Page
      backAction={{ url: "/app" }}
      title={`Customers Products`}
      subtitle={`Customers total products count in the month of ${selectedMonth.label}`}
      compactTitle
      fullWidth
    >
      <Card>
        {!isProductsFetched ? (
          <Text variant="headingLg" as="h2">
            {message + selectedMonth.label}
          </Text>
        ) : (
          <DataTable
            columnContentTypes={["numeric", "text", "numeric"]}
            headings={["Sno", "First Name", "Products Count"]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
}
