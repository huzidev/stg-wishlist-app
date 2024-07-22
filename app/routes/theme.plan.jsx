import { json } from "@remix-run/node";
import { globalHeaders } from "~/utils/data";

export async function loader() {
  console.log("SW is this running?? VERCEL");
  const store = await prisma.store.findFirst({
    where: {
      shopify_url: "stg-wishlist-store.myshopify.com",
    },
  });
  return json(
    {
      data: store,
    },
    globalHeaders,
  );
}
