import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

export async function loader({ params }) {
  const { userId, type } = params;
  console.log("params", params);
  console.log("REMIX type for index", type);
  let data;
  if (type === "drawer") {
    const lists = await prisma.list.findMany({
      where: {
        customer_id: userId,
      },
    });
    const listSet = [...new Set(lists.map((list) => list.id))];
    let productsResponse = [];
    let response;
    for (let list of listSet) {
      response = await prisma.product.findMany({
        where: {
          listId: list,
        },
      });
      if (response) {
        productsResponse = productsResponse.concat(response);
      }
    }
    data = productsResponse.map((product) => {
      const { shopify_url, handle } = product;
      return {
        ...product,
        product_url: `https://${shopify_url}/products/${handle}`,
      };
    });
  } else {
    const lists = await prisma.list.findMany({
      where: {
        customer_id: userId,
      },
      include: {
        products: true,
      },
    });
    data = lists.reduce((acc, list) => {
      return acc.concat(
        list.products.map((product) => ({
          ...product,
        })),
      );
    }, []);
    console.log("data updated REMIX for all products", data);
  }

  return json(
    {
      message: `${data.length} Products Fetched successfully`,
      data,
    },
    globalHeaders,
  );
}
