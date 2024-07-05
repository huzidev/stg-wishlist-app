import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Icon,
  InlineGrid,
  InlineStack,
  Link,
  Page,
  Select,
  Spinner,
  Text
} from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import React, { useEffect, useState } from "react";
import Customer from "~/models/Customers.server";
import Shop from "~/models/db/Shop.server";
import { authenticate } from "~/shopify.server";
import { months } from "../utils/data";

export async function loader({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const shop = new Shop(session.shop, admin.graphql);
  const customers = new Customer(session.shop, admin.graphql);
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const startDate = new Date(y, m, 0);
  const endDate = new Date(y, m + 1, 0);
  const products = await shop.getProductsByMonth(startDate, endDate);
  let customerIdArray;
  const response = await shop.getAllLists();
  let customersData;
  if (response.type === "success") {
    customerIdArray = Object.keys(response.data);
    customersData = await customers.getCustomers(
      customerIdArray,
      startDate,
      endDate,
    );
  }
  return json({
    response,
    products,
    customersData,
  });
}

export async function action({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const { month, customersId } = await request.json();
  const customers = new Customer(session.shop, admin.graphql);
  const shop = new Shop(session.shop, admin.graphql);
  const date = new Date();
  const y = date.getFullYear();
  const m = month;
  const startDate = new Date(y, m - 1, 0);
  const endDate = new Date(y, m, 0);
  const products = await shop.getProductsByMonth(startDate, endDate);
  const customersData = await customers.getCustomers(
      customersId,
      startDate,
      endDate,
    );
  
  return json({
    products,
    customersData,
  });
}

export default function AppPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData();
  const { response, products, customersData } = useLoaderData();
  const date = new Date();
  const [totalLists, setTotalLists] = useState(0);
  const isResponseSuccess = response.type === "success";
  const [totalCustomers, setTotalCustomers] = useState(
    customersData?.length ?? 0,
  );
  const [customersId, setCustomersId] = useState([]);
  const [totalProducts, setTotalProducts] = useState(
    products.data?.length ?? 0,
  );
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentMonthData = months.find((month) => month.label === currentMonth);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isResponseSuccess) {
      setTotalLists(response.total);
      setCustomersId(Object.keys(response.data));
    }
  }, [isResponseSuccess]);

  function handleMonthChange(val) {
    setLoading(true)
    const select = months.find((month) => month.value === val);
    setSelectedMonth(select);
    submit(
      { month: val, customersId,  action: "change-month" },
      { replace: true, method: "POST", encType: "application/json" },
    );
  }

  // products according to the month
  useEffect(() => {
    if (actionData?.products && actionData?.customersData) {
      setTotalProducts(actionData?.products.data.length);
      setTotalCustomers(actionData?.customersData.length);
      setLoading(false);
    }
  }, [actionData]);

  const viewLink = (
    <InlineStack as="span">
      View
      <Icon source={ArrowRightIcon} tone="base" />
    </InlineStack>
  );

  const loadingSpin = (
    <Spinner
      accessibilityLabel="Spinner example"
      size="small"
    />
  )

  const currentSelectedMonth = selectedMonth.label.toLowerCase();

  return (
    <Page
      title={`WishList Dashboard`}
      compactTitle
      actionGroups={[
        {
          title: "More Actions",
          actions: [
            {
              content: "Plans",
              onAction: () => navigate("/app/plans"),
            },
            {
              content: "Support",
              onAction: () => navigate("/app/support"),
            },
          ],
        },
      ]}
      primaryAction={{
        content: "Yours Stats",
        url: "/app/settings",
      }}
      fullWidth
    >
      <BlockStack gap="200">
        <Card>
          <BlockStack gap="500">
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Select
                  label="Select Month"
                  options={months}
                  onChange={handleMonthChange}
                  value={selectedMonth.value}
                />
              </Grid.Cell>
            </Grid>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card>
                  <Text as="h2" variant="headingMd">
                    {selectedMonth.label}
                  </Text>
                  {loading ? (
                    loadingSpin
                  ) : (
                    <>
                      <InlineGrid alignItems="center" columns="1fr auto">
                        <Box paddingBlock="200">
                          <Text as="h3" variant="headingMd">
                            {totalProducts}
                          </Text>
                        </Box>
                        <Link url={`/app/products/${currentSelectedMonth}`}>
                          {viewLink}
                        </Link>
                      </InlineGrid>
                      <Text as="p">
                        Total of {totalProducts} products were added in{" "}
                        {selectedMonth.label}
                      </Text>
                    </>
                  )}
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card>
                  <Text as="h2" variant="headingMd">
                    Total Customers
                  </Text>
                  {loading ? (
                    loadingSpin
                  ) : (
                    <>
                      <InlineGrid alignItems="center" columns="1fr auto">
                        <Box paddingBlock="200">
                          <Text as="h3" variant="headingMd">
                            {totalCustomers}
                          </Text>
                        </Box>
                        <Link url={`/app/customers/${currentSelectedMonth}`}>
                          {viewLink}
                        </Link>
                      </InlineGrid>
                      <Text as="p">
                        Total of {totalCustomers} customers added products in{" "}
                        {selectedMonth.label}
                      </Text>
                    </>
                  )}
                </Card>
              </Grid.Cell>
            </Grid>
          </BlockStack>
        </Card>
        <Card>
          <Card>
            <Text as="h2" variant="headingMd">
              Total Lists Created
            </Text>
            <Box paddingBlockStart="200">
              <Text as="h3" variant="headingMd">
                {totalLists}
              </Text>
            </Box>
          </Card>
        </Card>
        <Box>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate("/app/lists")}
          >
            View All Lists
          </Button>
        </Box>
      </BlockStack>
    </Page>
  );
}
