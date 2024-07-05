import prisma from "../db.server";

export default class Plan {
  constructor(shop, graphql) {
    this.shopUrl = shop;
    this.graphql = graphql;
  }

  async getPlan() {
    try {
      const store = await prisma.store.findFirst({
        where: {
          shopify_url: this.shopUrl,
        },
      });
      if (!store) {
        return {
          type: "no-plan",
          message: "Please select a plan first",
        };
      } else {
        const { plan, discounts } = store;
        const type = plan === 1 ? "Basic" : plan === 2 ? "Standard" : "Advanced";
        return {
          data: store,
          type,
          plan,
          discounts, 
          message: `You've ${type} plan`,
        };
      }
    } catch (error) {
      console.error("Error : ", error);
      throw error;
    }
  }

  async buyPlan(plan) {
    try {
      const type = plan === 1 ? "Basic" : plan === 2 ? "Standard" : "Advanced";
      const prevPlan = await prisma.store.findFirst({
        where: {
          shopify_url: this.shopUrl,
        },
      });
      if (!!prevPlan) {
        const { id } = prevPlan;
        await prisma.store.update({
          where: {
            id,
          },
          data: {
            plan,
            discounts: 0,
            created_at: new Date(),
          },
        });
      } else {
        await prisma.store.create({
          data: {
            shopify_url: this.shopUrl,
            plan,
          },
        });
      }
      return {
        type,
        plan,
        message: `You've activated ${type} plan`,
      };
    } catch (error) {
      console.error("Error : ", error);
      throw error;
    }
  }
}
