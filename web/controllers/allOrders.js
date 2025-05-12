export const fetchOrders =async (client) => {
    try {

        const response = await client.query({
            data: `
        query {
          orders(first: 50) {
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
        // console.log('-------------------------------------------------------------------------------------------------------------------')
        // console.log("orders ------->>>", orders);
        return orders;

    } catch (err) {
        console.log(err)
    }
}
