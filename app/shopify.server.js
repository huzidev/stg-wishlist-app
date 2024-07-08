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
export const STANDARD_PLAN = 'Standard';
export const ADVANCED_PLAN = 'Advanced';

const scopes = "write_products, read_customers, write_discounts";

const shopify = shopifyApp({
  // apiKey: process.env.SHOPIFY_API_KEY,
  apiKey: "0561667a78a7971bf4c293af69121faf",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: scopes.split(","),
  // appUrl: process.env.SHOPIFY_APP_URL || "",
  appUrl: "https://stg-wishlist-app.vercel.app",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
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
