import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

// to fetch products according to the selected list
export async function loader({ params }) {
  const { listId } = params;
  const response = await prisma.product.findMany({
    where: {
      listId: parseInt(listId),
    },
  });
  // to return product_url with products data in data object
  const data = response.map((product) => {
    const { shopify_url, handle } = product;
    return {
      ...product,
      product_url: `https://${shopify_url}/products/${handle}`,
    };
  });
  return json(
    {
      message: `${data.length} Products Fetched successfully`,
      data,
    },
    globalHeaders,
  );
}
