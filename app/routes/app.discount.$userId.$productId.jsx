import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useSubmit
} from "@remix-run/react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  InlineStack,
  Page,
  Spinner,
  Text,
  TextField
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import Customer from "~/models/Customers.server";
import Product from "~/models/Products.server";
import Shop from "~/models/db/Shop.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request, params }) {
  const { userId, productId } = params;
  const { session, admin } = await authenticate.admin(request);
  const customers = new Customer(session.shop, admin.graphql);
  const product = new Product(session.shop, admin.graphql);
  const shop = new Shop(session.shop, admin.graphql);
  const response = await shop.getProduct(parseInt(productId));
  const customerData = await customers.getCustomer(userId);
  const productData = await product.getProduct(response?.data?.shopify_id);
  return json({
    userId,
    customerData,
    response,
    productData,
  });
}

export async function action({ request, params }) {
  const { session, admin } = await authenticate.admin(request);
  const { productId } = params;
  const shop = new Shop(session.shop, admin.graphql);
  const { percentage } = await request.json();
  const config = {
    id: parseInt(productId),
    percentage: parseFloat(percentage),
  };
  const response = await shop.addDiscount(config);
  return json({
    response,
  });
}

export default function Discount() {
  const { userId, customerData, response, productData } = useLoaderData();
  const action = useActionData();
  const [product, setProduct] = useState();
  const [percentage, setPercentage] = useState(0);
  const [productPrice, setProductPrice] = useState({
    currentPrice: 0,
    discountedPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isDiscountAdded, setIsDiscountAdded] = useState(false);
  const { type, data, message } = response;
  const isProductFetched = type === "success";
  const submit = useSubmit();
  const isCustomerDetailsFetched = customerData?.type === 'success';
  const customerName = customerData?.data?.firstName;
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  async function setProductData() {
    setProduct({ ...productData, ...data });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDataFetched(true);
  }

  useEffect(() => {
    if (productData || data) {
      setProductData();
    }
  }, [data, productData]);

  const { title, handle, discount, shopify_url, variants } = !!product && product;
  const product_url = `https://${shopify_url}/products/${handle}`;
  const { currentPrice, discountedPrice } = productPrice;

  useEffect(() => {
    if (discount) {
      setPercentage(discount);
    }
    if (variants) {
      const { price } = variants.edges[0].node;
      setProductPrice({
        currentPrice: price,
        discountedPrice: discount ? (price - (price * discount) / 100).toFixed(2) : price,
      });
    }
  }, [discount, variants]);

  useEffect(() => {
    if (percentage) {
      setProductPrice((prevPrice) => ({
        ...prevPrice,
        discountedPrice: (currentPrice - (currentPrice * percentage) / 100).toFixed(2),
      }));
    }
  }, [percentage]);

  useEffect(() => {
    if (action?.response.type === "success") {
      setIsDiscountAdded(true);
      setLoading(false);
    }
  }, [action])

  function handleSubmit() {
    setLoading(true);
    submit(
      { percentage },
      { replace: true, method: "POST", encType: "application/json" },
    );
  }

  return (
    <Page
      backAction={{ url: `/app/lists/${userId}` }}
      title="Create Discount"
      subtitle={`${isProductFetched && isCustomerDetailsFetched ? `Discount for ${customerName} on product ${title}` : `Customer Or Product id doesn't match with any record`} `}
      compactTitle
      fullWidth
    >
      {!isDataFetched ? (
        <InlineStack blockAlign="center" gap="200" direction="row">
          <Text variant="headingLg" as="h1">
            Please wait
          </Text>
          <Spinner size="small" />
        </InlineStack>
      ) : (
        <>
          {isDiscountAdded && (
            <Banner
              title={`Discount of ${percentage}% given successfully to ${customerName} on product ${title}`}
              tone="success"
              onDismiss={() => setIsDiscountAdded(false)}
            />
          )}
          <Card>
            {!isProductFetched || !isCustomerDetailsFetched ? (
              <Text as="h3" variant="headingLg">
                {!isProductFetched ? message : customerData?.message}
              </Text>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    value={customerName}
                    label="Username"
                    type="text"
                    readOnly={true}
                  />
                  <TextField
                    value={title}
                    label="Product Title"
                    type="text"
                    readOnly={true}
                  />
                  <TextField
                    value={handle}
                    label="Product Handle"
                    type="text"
                    readOnly={true}
                  />
                  <TextField
                    value={currentPrice}
                    label="Current Price"
                    type="text"
                    readOnly={true}
                  />
                  <TextField
                    value={discountedPrice}
                    label="Discounted Price"
                    type="text"
                    readOnly={true}
                  />
                  <TextField
                    value={percentage}
                    name="percentage"
                    onChange={(v) => {
                      if (v <= 100 && v >= 0) {
                        setPercentage(v);
                      }
                    }}
                    max={100}
                    min={0}
                    label="Percentage Off"
                    type="number"
                    onFocus={() => setIsDiscountAdded(false)}
                  />
                  {loading ? (
                    <Spinner size="small" />
                  ) : (
                    <ButtonGroup>
                      <Button submit>
                        {discount > 0 ? "Edit" : "Add"} Discount
                      </Button>
                      <Button onClick={() => open(product_url, "_blank")}>
                        View Product
                      </Button>
                    </ButtonGroup>
                  )}
                </FormLayout>
              </Form>
            )}
          </Card>
        </>
      )}
    </Page>
  );
}
