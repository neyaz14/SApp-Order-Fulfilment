import express from "express";
import shopify from "../shopify.js";

const router = express.Router();

router.get("/count", async (req, res) => {
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


export default router;