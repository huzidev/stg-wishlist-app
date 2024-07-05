import { json } from "@remix-run/node";
import prisma from "~/db.server";
import { globalHeaders } from "~/utils/data";

// fetch all lists
export async function loader({ params }) {
  const { userId } = params;
  const response = await prisma.list.findMany({
    where: {
      customer_id: userId,
    },
    include: {
      products: true,
    },
  });
  const data = response;
  return json(
    {
      message: `${data.length} Lists Fetched successfully`,
      data,
    },
    globalHeaders,
  );
}

export async function action({ request, params }) {
  const { userId } = params;
  const data = await request.json();
  const { title, shop_url, method, id, customerId } = data;
  const isAddRequest = method === "add-list";
  const isEditRequest = method === "edit-list";
  // update guestList to UserList (When user signedIn)
  const isUpdateRequest = method === "update-list";
  const isDeleteRequest = method === "delete-list";
  let response;
  // Create Wishlist
  if (isAddRequest) {
    response = await prisma.list.create({
      data: {
        title,
        customer_id: userId,
        shopify_url: shop_url,
      },
    });
  } // Edit Wishlist title 
  else if (isEditRequest) {
    response = await prisma.list.update({
      where: {
        id,
      },
      data: {
        title,
      },
      include: {
        products: true,
      },
    });
  } // Assign GuestList to loggedIn user 
  else if (isUpdateRequest) {
    const guestList = await prisma.list.findFirst({
      where: {
        customer_id: userId,
      },
    });
    const { id } = guestList;
    response = await prisma.list.update({
      where: {
        id,
      },
      data: {
        customer_id: customerId.toString(),
      },
      include: {
        products: true,
      },
    });
  } else if (isDeleteRequest) {
    response = await prisma.list.delete({
      where: {
        id,
      },
    });
  }
  return json(
    {
      type: isAddRequest
        ? "List-Added"
        : (isEditRequest || isUpdateRequest)
          ? "List-Updated"
          : isDeleteRequest && "List-Deleted",
      message: response.id
        ? "List with id " +
          response.id +
          (isAddRequest ? " Added" : isEditRequest ? " Updated" : " Deleted")
        : "Error",
      data: response,
    },
    globalHeaders,
  );
}
