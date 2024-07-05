import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

export async function loader({ params }) {
  const { userId } = params;
  const lists = await prisma.list.findMany({
    where: {
      customer_id: userId,
    },
  });
  const listSet = [...new Set(lists.map((list) => list.id))];
  let productsResponse = [];
  let response;
  for (let listId of listSet) {
    response = await prisma.product.findMany({
      where: {
        listId
      },
    });
    if (response) {
      productsResponse = productsResponse.concat(response);
    }
  }
  // const data = productsResponse.map((product) => {
  //   const { shopify_url, handle } = product;
  //   return {`
  //     ...product,
  //     product_url: `https://${shopify_url}/products/${handle}`,
  //   };
  // });
  console.log(
    "data for fetch all products according to userId",
    productsResponse,
  );
  return json(
    {
      message: `${productsResponse.length} Products Fetched successfully`,
      data: productsResponse,
    },
    globalHeaders,
  );
}