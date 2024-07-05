export default class Product {
  constructor(shop, graphql) {
    this.shopUrl = shop;
    this.graphql = graphql;
  }

  async getProduct(productId) {
    try {
      const response = await this.graphql(`
      query {
        product(id: "gid://shopify/Product/${productId}") {
          title
          status
          variants(first:1) {
              edges {
                node {
                  price
                }
              }
            }
        }
      }
    `);
      const data = await response.json();
      console.log("Product Response from graphQL", data);
      return data.data.product;
    } catch (e) {
      console.log("Error: ", e);
    }
  }
}
