// Updated function to handle pagination
export const fetchOrdersPage = async (client, cursor = null, direction = "next", limit = 10) => {
  try {
    // Convert limit to number
    const parsedLimit = parseInt(limit);
    
    // Build the pagination variables based on direction and cursor
    let paginationQuery;
    if (direction === "next") {
      paginationQuery = cursor ? `after: "${cursor}", first: ${parsedLimit}` : `first: ${parsedLimit}`;
    } else {
      paginationQuery = cursor ? `before: "${cursor}", last: ${parsedLimit}` : `last: ${parsedLimit}`;
    }

    const response = await client.query({
      data: `
        query {
          orders(${paginationQuery}) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                id
                tags
                processedAt
                displayFulfillmentStatus
                displayFinancialStatus
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                customer {
                  firstName
                  lastName
                  email
                  phone
                }
                fulfillmentOrders(first: 50) {
                  edges {
                    node {
                      id
                      status
                      lineItems(first: 50) {
                        edges {
                          node {
                            id
                            lineItem {
                              quantity
                            }
                          }
                        }
                      }
                    }
                  }
                }

                lineItems(first: 50) {
                  edges {
                    node {
                      title
                      quantity
                      sku
                      variantTitle
                      originalUnitPriceSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }

                shippingAddress {
                  address1
                  address2
                  city
                  province
                  country
                  zip
                  phone
                }
              }
            }
          }
        }
      `
    });

    const orders = response.body.data.orders;
    return orders;

  } catch (err) {
    console.error(err);
    throw err;
  }
}