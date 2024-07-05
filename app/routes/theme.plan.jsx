import { json } from "@remix-run/node";
import { globalHeaders } from "~/utils/data";

export async function loader() {
  const store = await prisma.store.findFirst({
    where: {
      shopify_url: this.shopUrl,
    },
  });
  return json(
    {
      data: store,
    },
    globalHeaders,
  );
}
