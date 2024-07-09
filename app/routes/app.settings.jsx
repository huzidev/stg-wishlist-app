import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import React from "react";
import Profile from "../components/settings/Profile";
import Plan from "../models/Billing.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const plan = new Plan(session.shop, admin.graphql);
  const currentPlan = await plan.getPlan();
  return json({
    currentPlan,
  });
}

export default function Settings() {
  const { currentPlan } = useLoaderData();
  const { type, discounts, data } = currentPlan;

  return (
    <Page
      backAction={{ url: "/app" }}
      title="Stats"
      subtitle="Merchant's Profile"
      compactTitle
      fullWidth
      primaryAction={{
        content: "View Plans",
        url: "/app/plans",
      }}
    >
      <Profile data={data} type={type} discounts={discounts} />
    </Page>
  );
}
