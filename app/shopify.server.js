import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  BillingInterval,
  DeliveryMethod,
  LATEST_API_VERSION,
  shopifyApp
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
// import Shopify from "@shopify/shopify-api";
export const STANDARD_PLAN = 'Standard';
export const ADVANCED_PLAN = 'Advanced';

console.log("SW process.env.SCOPES", process.env.SCOPES);
console.log("SW process.env.SCOPES?.split(",")", process.env.SCOPES?.split(","));

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  // sessionStorage: new PrismaSessionStorage(process.env.POSTGRES_PRISMA_URL),
  // sessionStorage: new Shopify.Session.PostgreSQLSessionStorage(new URL(process.env.POSTGRES_PRISMA_URL)),
  distribution: AppDistribution.AppStore,
  restResources,
  cookies: {
    secure: true,
    sameSite: 'none',
  },
  billing: {
    [STANDARD_PLAN]: {
      amount: 19.99,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
    [ADVANCED_PLAN]: {
      amount: 49.99,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    }
  },
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
