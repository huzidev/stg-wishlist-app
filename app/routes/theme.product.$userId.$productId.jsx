import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

export async function loader({ params }) {
  const { userId, productId } = params;
  const response = await prisma.list.findFirst({
    where: {
      customer_id: userId,
    },
    include: {
      products: {
        where: {
          shopify_id: productId,
        },
      },
    },
  });

  const productData = response?.products[0];

  return json(
    {
      message: `Product Fetched successfully`,
      response,
      productData,
    },
    globalHeaders,
  );
}

export async function action({ request, params }) {
  const { productId } = params;
  const data = await request.json();
  const { handle, shop_url, listId, method, id } = data;
  let response;
  console.log("ID for increment count", id);
  console.log("method for increment count", method);
  const isAddProduct = method === "add-product";
  const isProductClicked = method === "add-count";
  if (isAddProduct) {
    response = await prisma.product.create({
      data: {
        handle,
        shopify_id: productId,
        shopify_url: shop_url,
        listId,
      },
    });
  } else if (isProductClicked) {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        clicks: {
          increment: 1,
        },
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
      type: isAddProduct ? "product-added" : "product-removed",
      message: `Product ${isAddProduct ? "added into " : "removed from "} wishlist successfully`,
      data: response,
    },
    globalHeaders,
  );
}
