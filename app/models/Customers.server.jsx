export default class Customer {
  constructor(shop, graphql) {
    this.shopUrl = shop;
    this.graphql = graphql;
  }


  async getCustomers(arrayOfId, startDate, endDate) {
    try {
      const resultArray = [];
      for (const customerId of arrayOfId) {
        const response = await this.graphql(`
        query {
          customer(id: "gid://shopify/Customer/${customerId}") {
            id
            firstName
            createdAt
          }
        }
      `);

        const data = await response.json();
        if (data && data.data && data.data.customer) {
          const { createdAt, id, firstName } = data.data.customer;
          const currentDate = new Date(createdAt);
          if ((currentDate >= startDate && currentDate <= endDate) || (!startDate && !endDate)) {
            resultArray.push({
              id,
              firstName,
            });
          }
        }
      }

      return resultArray;
    } catch (e) {
      console.log("Error: ", e);
      return [];
    }
  }

  async getCustomer(customerId) {
    try {
      const response = await this.graphql(`
        query {
          customer(id: "gid://shopify/Customer/${customerId}") {
            id
            firstName
          }
        }
      `);
      const data = await response.json();
      const res = data.data.customer;
      if (!res) {
        return {
          type: "error",
          message: `No customer found`,
        };
      }
      return {
        type: "success",
        data: res,
        message: `Customer details fetched successfully`,
      };
    } catch (e) {
      console.log("Error: ", e);
    }
  }
}
