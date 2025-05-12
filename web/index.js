// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";


// ? ----------- Routes 
import productRoutes from "./routes/productCountRoute.js";
import { fetchShopMetafield } from "./controllers/fetchShopMetafield.js";
import { log } from "console";
import { fetchOrders } from "./controllers/allOrders.js";
import { fetchOrdersPage } from "./controllers/allOrderspage.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());


// app.use("/api/products", productRoutes);


// ? read shopinformation 
// app.get('/api/store/info', async(req, res)=>{
//   let storeInfo = await shopify.api.rest.Shop.all({
//     session: res.locals.shopify.session,
//   });
//   console.log('-----------------------------------------------------------------------------------------')
//   console.log('shopify ------> ',shopify)
//   console.log('storeInfo ++++++> ',storeInfo)
//   console.log('res  ========= >>>>>',res?.locals?.shopify?.session)
//   res.status(200).send(storeInfo);
// })





app.get("/api/shop-domain", async (req, res) => {
  const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session, });

  const query = `
    query GetShopDomain {
      shop {
        myshopifyDomain
        primaryDomain {
          url
          host
        }
      }
    }
  `;

  try {
    const response = await client.query({ data: { query } });
    const shopInfo = {
      myshopifyDomain: response.body.data.shop.myshopifyDomain,
      primaryUrl: response.body.data.shop.primaryDomain.url,
      primaryHost: response.body.data.shop.primaryDomain.host,
    }
    // console.log('shopInfo --------->>>', shopInfo)

    // return shopInfo
    res.send(shopInfo)
  } catch (error) {
    console.error("Error fetching shop domain:", error);
    throw error;
  }
});




// app.get("/api/shop-metafield", async (req, res) => {
//   const session = res.locals.shopify.session;

//   try {
//     const value = await fetchShopMetafield(session);
//     res.status(200).json({ value });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch metafield." });
//   }
// });

app.get("/api/shop-metafield", async (req, res) => {
  // const session = res.locals.shopify.session;

  try {
    // const value = await fetchShopMetafield(session);
    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });

    const query = `
    query ShopMetafield($namespace: String!, $key: String!) {
      shop {
        copyrightYear: metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }`;

    const variables = {
      namespace: "my_fields",
      key: "copyright_year",
    };


    const response = await client.query({
      data: {
        query,
        variables,
      },
    });

    const value = response?.body?.data?.shop?.copyrightYear?.value;

    return response
    // res.status(200).json({ value });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metafield." });
  }
});



app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    // console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});






// ! -------------------------
// ? -------------------------------


app.get("/api/orders", async (req, res) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });

  try {
   
    const orders =await fetchOrders(client)
    // console.log('order form app  ------> ',orders)
    res.status(200).json(orders);
  } catch (error) {
    console.log('--------------------------------')
    console.error("Error fetching orders:", error);

    res.status(500).json({ error: "Failed to fetch orders" });
  }
});







// ? ------------ AddConfirmed tag

app.post('/api/add-confirmed-tag', async (req, res) => {
  const { orderId } = req.body;
  // console.log('---------------- order id --------------------')
  // console.log(orderId)

  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }
  const session = res.locals.shopify.session;
  // console.log('-------->>  session', session)
  const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
  // console.log('++++++++++++   >>  client', client)

  try {

    const query = `
      mutation tagsAdd($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          node {
            ... on Order {
              id
              tags
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      id: orderId,
      tags: ['Confirmed'],
    };

    const response = await client.request(query, { variables });

    // console.log('---------------- response --------------------')
    // console.log(response)

    const userErrors = response.body.data.tagsAdd.userErrors;

    if (userErrors.length > 0) {
      return res.status(400).json({ error: 'Tagging failed', details: userErrors });
    }

    res.status(200).json({
      success: true,
      data: response.body.data.tagsAdd,
    });

  } catch (error) {
    console.log('--------------------------Console log-----------------------------------')
    console.error('Error tagging order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});









// Updated API endpoint to support pagination
app.get("/api/ordersPage", async (req, res) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  const { cursor, direction = "next", limit = 10 } = req.query;

  try {
    const orders = await fetchOrdersPage(client, cursor, direction, limit);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});










// ! -----------------------
// ? --------------------------------












app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
