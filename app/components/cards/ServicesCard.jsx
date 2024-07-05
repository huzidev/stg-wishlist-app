import {
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Text
} from "@shopify/polaris";
import React from "react";

export default function ServicesCard({ service, url }) {
  const { title, description, icon } = service;
  return (
    <Card roundedAbove="sm">
      <InlineGrid alignItems="center" columns="1fr auto">
        <BlockStack inlineAlign="start">
          <InlineStack gap="150">
            <Icon source={icon} tone="base" />
            <Text as="h2" variant="headingMd">  
              {title}
            </Text>
          </InlineStack>
        </BlockStack>
        <Button
          onClick={() => open(url, "_blank")}
          accessibilityLabel="Let's talk"
        >
          Let's talk
        </Button>
      </InlineGrid>
      <Box paddingBlockStart="200">
        <Text as="p" variant="bodyMd">
          {description}
        </Text>
      </Box>
    </Card>
  );
} 
