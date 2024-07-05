import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

export async function loader({ params }) {
  const { productId } = params;
  let response = await prisma.product.findFirst({
    where: {
      shopify_id: productId,
    },
  });
  return json(
    {
      message: `Product Fetched successfully`,
      data: response,
    },
    globalHeaders,
  );
}

export async function action({ request, params }) {
  const { productId } = params;
  const data = await request.json();
  const { handle, shop_url, listId, method, id } = data;
  let response;
  if (method === "add-product") {
    response = await prisma.product.create({
      data: {
        handle,
        shopify_id: productId,
        shopify_url: shop_url,
        listId
      },
    });
  } else {
    response = await prisma.product.delete({
      where: {
        id,
      },
    });
  }
  return json(
    {
      type: method === 'add-product' ? 'product-added' : 'product-removed',
      message: `Product ${method === "add-product" ? "added into " : "removed from "} wishlist successfully`,
      data: response,
    },
    globalHeaders,
  );
}
