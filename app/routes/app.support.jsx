import { BlockStack, Link, Page, Text } from "@shopify/polaris";
import React from "react";
import ServicesCard from "../components/cards/ServicesCard";
import { Services } from "../utils/services";

export default function Support() {
  const contactURL = "https://www.1s.agency/contact";
  return (
    <Page
      backAction={{ url: `/app` }}
      title="Help & Support"
      subtitle="Get Connect With Us"
      compactTitle
    >
      <BlockStack gap="300">
        {Services.map((service, i) => (
          <ServicesCard url={contactURL} service={service} key={i} />
        ))}
      </BlockStack>
      <BlockStack gap="200">
        <Text variant="headingMd">
          Contact:{" "}
          <Link to="mailto:contact@1s.agency">contact@1s.agency</Link>
        </Text>
      </BlockStack>
    </Page>
  );
}
