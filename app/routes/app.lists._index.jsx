import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Card, DataTable, Page, Text } from "@shopify/polaris";
import React from "react";
import Customer from "~/models/Customers.server";
import Shop from "~/models/db/Shop.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const customers = new Customer(session.shop, admin.graphql);
  const shop = new Shop(session.shop, admin.graphql);
  const response = await shop.getAllLists();
  let customerIdArray;
  let customersData;
  if (response.type === "success") {
    customerIdArray = Object.keys(response.data);
    customersData = await customers.getCustomers(customerIdArray);
  }

  return json({
    response,
    customersData,
  });
}

export default function AllLists() {
  const { response, customersData } = useLoaderData();
  let rows;
  if (customersData) {
    rows = customersData.map((customer, index) => {
        const customerId = customer.id.replace("gid://shopify/Customer/", "");
        const arrayForCustomer = response.data[customerId];
        const totalCount = arrayForCustomer ? arrayForCustomer.length : 0;
        return [
          index + 1,
          <Link to={`/app/lists/${customerId}`}>{customer.firstName}</Link>,
          totalCount,
        ];
      });
  }

  return (
    <Page
      backAction={{ url: "/app" }}
      title='Customers Lists Count'
      subtitle='Wishlists created by customers'
      compactTitle
      fullWidth
    >
      <Card>
        {response.type === "error" ? (
          <Text variant="headingLg" as="h2">
            {response.message}
          </Text>
        ) : (
          <DataTable
            columnContentTypes={["numeric", "text", "numeric"]}
            headings={["Sno", "First Name", "Lists Count"]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
}
