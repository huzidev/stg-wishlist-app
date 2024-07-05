import { Banner, Card, DataTable } from "@shopify/polaris";
import React from "react";

export default function Profile({ data, type, discounts }) {
  const isBasicPlan = type === "Basic";
  const isLimitReached = type === "Standard" && discounts === 20;
  const createdAt = new Date(data.created_at);
  const expiryDate = new Date(createdAt);
  expiryDate.setDate(createdAt.getDate() + 30);

  const now = new Date();
  const expiresIn = Math.max(
    0,
    Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)),
  );
  const rows = [
    [
      type,
      isBasicPlan ? `Not included in plan` : discounts,
      expiresIn + " days",
    ],
  ];

  return (
    <>
      {isLimitReached && (
        <Banner
          title={`You've reached the limit of giving discounts which was 20`}
          tone="warning"
        ></Banner>
      )}
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text"]}
          headings={["Plan Type", "Discounts offered", "Expires In"]}
          rows={rows}
        />
      </Card>
    </>
  );
}
