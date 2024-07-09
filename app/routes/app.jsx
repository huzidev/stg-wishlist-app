import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
  useSubmit
} from "@remix-run/react";
import { Provider } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { useEffect } from "react";
import customStyles from "~/styles/custom.css";
import Plan from "../models/Billing.server";
import {
  ADVANCED_PLAN,
  STANDARD_PLAN,
  authenticate
} from "../shopify.server";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: customStyles },
];

export const loader = async ({ request }) => {
  const { session, admin, billing } = await authenticate.admin(request);
  const plan = new Plan(session.shop, admin.graphql);
  const res = await plan.getPlan();
  let isPlanActivated = false;
  // Shopify Billing feature
  try {
    const billingCheck = await billing.require({
      plans: [STANDARD_PLAN, ADVANCED_PLAN],
      isTest: true,
      onFailure: () => (isPlanActivated = false),
    });
    console.log("SW what is in billings", billingCheck);
  } catch (e) {
    console.log("Error", e);
  }
  return json({ res, apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export async function action({ request }) {
  const { session, admin } = await authenticate.admin(request);
  const plan = new Plan(session.shop, admin.graphql);
  const { id } = await request.json();
  const response = await plan.buyPlan(id);
  return json({
    response
  });
}

export default function App() {
  const { apiKey, res } = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    // by default select basic plan
    if (res.type === "no-plan") {
    submit(
      { id: 1 },
      { replace: true, method: "POST", encType: "application/json" },
    );
    }
  }, [res]);

  return (
    <Provider isEmbeddedApp apiKey={apiKey}>
       <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/settings">Yours Stats</Link>
        <Link to="/app/plans">Change Plan</Link>
        <Link to="/app/support">Get Support</Link>
      </ui-nav-menu>
      <Outlet />
    </Provider>
    // <AppProvider isEmbeddedApp apiKey={apiKey}>
    //   <ui-nav-menu>
    //     <Link to="/app" rel="home">
    //       Home
    //     </Link>
    //     <Link to="/app/settings">Yours Stats</Link>
    //     <Link to="/app/plans">Change Plan</Link>
    //     <Link to="/app/support">Get Support</Link>
    //   </ui-nav-menu>
    //   <Outlet />
    // </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
