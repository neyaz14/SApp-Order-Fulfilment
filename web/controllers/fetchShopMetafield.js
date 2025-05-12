import shopify from "../shopify.js"; // or wherever your shopify object is defined

// This function can be placed in a route or called from a controller/service
export async function fetchShopMetafield(session) {
  const client = new shopify.api.clients.Graphql({ session });

  const query = `
    query ShopMetafield($namespace: String!, $key: String!) {
      shop {
        copyrightYear: metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }
  `;

  const variables = {
    namespace: "my_fields",
    key: "copyright_year",
  };

  try {
    const response = await client.query({
      data: {
        query,
        variables,
      },
    });

    return response.body.data.shop.copyrightYear?.value;
  } catch (error) {
    console.error("Failed to fetch shop metafield:", error);
    throw error;
  }
}
