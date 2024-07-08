import prisma from "../../db.server";

export default class Shop {
  constructor(shop, graphql) {
    this.shopUrl = shop;
    this.graphql = graphql;
    this.shop = null;
  }

  async getAllLists() {
    try {
      const lists = await prisma.list.findMany({
        where: {
          shopify_url: this.shopUrl,
        },
      });
      let response;
      if (!!lists.length) {
        response = lists.reduce((obj, item) => {
          const { customer_id, title, id } = item;
          const object = { id, title };
          if (obj[customer_id]) {
            obj[customer_id].push(object);
          } else {
            obj[customer_id] = [object];
          }
          return obj;
        }, {});
      } else {
        return {
          type: "error",
          message: "Currently, there are no wishlists here.",
        };
      }
      return {
        data: response,
        total: lists.length,
        type: "success",
        message: `${lists.length} Lists fetched successfully`,
      };
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }

  async getCustomerLists(customerId) {
    try {
      const lists = await prisma.list.findMany({
        where: {
          customer_id: customerId,
        },
      });
      return lists;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }

  async getListProducts(listId) {
    try {
      const products = await prisma.product.findMany({
        where: {
          listId,
        },
      });
      return products;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }

  // gte = greaterThanEqual, lte = LessThanEqual
  async getAllProducts(gte, lte) {
    try {
      const products = await prisma.product.findMany({
        where: {
          created_at: {
            gte,
            lte,
          },
          shopify_url: this.shopUrl,
        },
        include: {
          list: true,
        },
      });
      let response = {};
      if (!!products.length) {
        products.forEach((product) => {
          const customerId = product.list.customer_id;
          if (!response[customerId]) {
            response[customerId] = 0;
          }
          response[customerId]++;
        });
        return {
          data: response,
          type: "success",
          message: `Products fetched successfully`,
        };
      } else {
        return {
          type: "empty",
          data: response,
          message: `No product were added in the month of `,
        };
      }
    } catch (e) {
      console.error("Error :", e);
      throw e;
    }
  }

  async getProduct(id) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id,
        },
      });
      if (!product) {
        return {
          type: "error",
          message: `Sorry, no product found`,
        };
      }
      return {
        type: "success",
        data: product,
        message: `product fetched successfully`,
      };
    } catch (e) {
      console.error("Error :", e);
      throw e;
    }
  }

  async addDiscount(config) {
    try {
      const { id, percentage } = config;
      const resposne = await prisma.product.update({
        where: {
          id,
        },
        data: {
          discount: percentage,
        },
      });
      const plan = await prisma.store.findFirst({
        where: {
          shopify_url: this.shopUrl,
        },
      });
      await prisma.store.update({
        where: {
          id: plan.id,
        },
        data: {
          discounts: {
            increment: 1,
          },
        },
      });
      return {
        type: "success",
        data: resposne,
        message: `Discount Added successfully`,
      };
    } catch (e) {
      console.error("Error :", e);
      throw e;
    }
  }

  // gte = greaterThanEqual, lte = LessThanEqual
  async getProductsByMonth(gte, lte) {
    try {
      const products = await prisma.product.findMany({
        where: {
          created_at: {
            gte,
            lte,
          },
          shopify_url: this.shopUrl,
        },
      });
      if (!products.length) {
        return {
          type: "empty",
          data: products,
          message: `No product were added in the month of `,
        };
      }
      return {
        type: "success",
        data: products,
        message: `${products.length} fetched successfully`,
      };
    } catch (e) {
      console.error("Error :", e);
      throw e;
    }
  }
}
