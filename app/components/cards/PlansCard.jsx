import { useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  List,
  Spinner,
  Text,
} from "@shopify/polaris";
import React from "react";
import { Plans } from "../../utils/plans";

export default function PlansCard({
  selectPlan,
  isPlanSelected,
  setSelectPlan,
  currentPlan,
}) {
  const submit = useSubmit();
  function handlePlan(id) {
    setSelectPlan({
      id,
      loading: true,
    });
    submit(
      { type: isPlanSelected ? "change-plan" : "select-plan", id },
      { replace: true, method: "POST", encType: "application/json" },
    );
  }

  return (
    <Layout>
      <Layout.Section>
        <InlineStack gap="200" align="center" spacing="loose">
          {Plans.map((plan) => {
            const { title, type, cost, id } = plan;
            const isPlanActivated = currentPlan?.res.plan === id;
            return (
              <div key={id} className={isPlanActivated ? "plan-activated" : ""}>
                <Card title={title} sectioned>
                  <Box
                    paddingInline="400"
                    paddingBlockStart="400"
                    paddingBlockEnd="100"
                  >
                    <BlockStack gap="200" inlineAlign="center">
                      <Text as="h1" variant="headingXl">
                        {type}
                      </Text>
                      <Text as="h3" variant="heading2xl">
                        {cost}
                      </Text>
                    </BlockStack>
                    <Box paddingBlock="300">
                      <Text as="h2" variant="headingLg">
                        Features
                      </Text>
                      <List type="bullet">
                        <Box paddingBlock="200">
                          {plan.features.map((feature, index) => (
                            <List.Item key={index}>{feature}</List.Item>
                          ))}
                        </Box>
                      </List>
                      <BlockStack align="center">
                        <Button
                          disabled={isPlanActivated}
                          onClick={() => handlePlan(id)}
                          variant="primary"
                        >
                          {id === selectPlan.id ? (
                            <Spinner size="small" />
                          ) : isPlanActivated ? (
                            "Activated"
                          ) : (
                            "Buy Now"
                          )}
                        </Button>
                      </BlockStack>
                    </Box>
                  </Box>
                </Card>
              </div>
            );
          })}
        </InlineStack>
      </Layout.Section>
    </Layout>
  );
}
