import { IHitPayWebhookRes } from "../../../src/utils/types";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
import type { NextApiRequest, NextApiResponse } from "next";
import { isEmpty } from "lodash";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: "wc/v3",
});
// Webhook is a POST request send from HitPay's server to your server about the payment confirmation. If you are using hitpay APIs to integrate into your e-commerce checkout you must mark your order as paid ONLY after the webhook is received and validated.
//
// Create an endpoint (E.g. /payment-confirmation/webhook) in your server that accepts POST requests. This request is application/x-www-form-urlencoded.
// Validate the webhook data using your salt value
// Return HTTP status code 200 to Hitpay
// Mark your order as paid
//KJJ come back later
//
//TODO: Verify HMAC later
const updateOrder = async (newStatus, orderId, transactionId = "") => {
  let newOrderData = {
    status: newStatus,
  };

  if (transactionId) {
    newOrderData.transaction_id = transactionId;
  }

  try {
    const { data } = await api.put(`orders/${orderId}`, newOrderData);
    console.log("✅ Order updated data", data);
  } catch (ex) {
    console.error("Order creation error", ex);
    throw ex;
  }
};

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data: IHitPayWebhookRes = req.body;
    try {
      await updateOrder("completed", data.reference_number, data.payment_request_id);
    } catch (error) {
      await updateOrder("failed", data.reference_number);
      console.error("Update order error", error);
    }

    res.status(200).json({ message: "everything a ok" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
