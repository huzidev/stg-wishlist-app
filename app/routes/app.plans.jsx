import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import PlansCard from "../components/cards/PlansCard";
import Plan from "../models/Billing.server";
import {
  ADVANCED_PLAN,
  STANDARD_PLAN,
  authenticate
} from "../shopify.server";
import { initialValues } from "../utils/plans";

export async function loader({ request }) {
  const { session, admin, billing } = await authenticate.admin(request);
  const plan = new Plan(session.shop, admin.graphql);
  // try {
  //   await billing.require({
  //     plans: [STANDARD_PLAN, ADVANCED_PLAN],
  //     isTest: true,
  //     onFailure: () => (console.log("No Plan")),
  //   });
  // } catch (e) {
  //   console.log("Error", e);
  // }
  const res = await plan.getPlan();
  return json({
    res,
  });
}

export async function action({ request }) {
  const { session, admin, billing } = await authenticate.admin(request);
  const plan = new Plan(session.shop, admin.graphql);
  const { type, id } = await request.json();
  const planType = id === 2 ? STANDARD_PLAN : id === 3 ? ADVANCED_PLAN : '';
  const { shop } = session;
  const response = await plan.buyPlan(id);
  const myShop = shop.replace(".myshopify.com", "");
  let changePlan;
  if (id !== 1) {
    changePlan = await billing.request({
      plan: planType,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/wishlist-app-dev-2/app`,
    })
  } else {
    try {
      const currentPlan = await billing.require({
        plans: [ADVANCED_PLAN, STANDARD_PLAN],
        onFailure: () => console.log("No Plan")
      });
      const subscription = currentPlan.appSubscriptions[0];
      changePlan = await billing.cancel({
        subscriptionId: subscription.id,
        isTest: true,
        prorate: true,
      });
    } catch (e) {
      console.log("Error", e);
    }
  }
  return json({
    response,
    type,
  });
}

export default function PlansPage() {
  const res = useLoaderData();
  const actionData = useActionData();
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  // const [currentPlan, setCurrentPlan] = useState('');
  const [selectPlan, setSelectPlan] = useState(initialValues);

  useEffect(() => {
    if (actionData) {
      setIsPlanSelected(true);
      setSelectPlan(initialValues);
      // setCurrentPlan(actionData.response.type);
      shopify.toast.show(`Plan changed successfully`);
    }
  }, [actionData]);

  useEffect(() => {
    if (res?.type === "no-plan") {
      setIsPlanSelected(false);
    } else {
      setIsPlanSelected(true);
    }
  }, [res]);

  const subTitle = "Please select a plan";
  return (
    <Page title="Select Plan" subtitle={subTitle} fullWidth>
      <PlansCard
        selectPlan={selectPlan}
        setSelectPlan={setSelectPlan}
        isPlanSelected={isPlanSelected}
        currentPlan={res}
      />
    </Page>
  );
}
