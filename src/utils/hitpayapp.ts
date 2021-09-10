import axios from "axios";
import qs from "qs";
import { IHitPayPaymentReq } from "./types";
//shift implementation to API
const baseUrl = "https://api.sandbox.hit-pay.com/v1";
const config = {
  headers: {
    // RMB TO CHANGE
    "X-BUSINESS-API-KEY": process.env.NEXT_PUBLIC_HITPAYAPP_API_KEY,
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const createHitPayCheckoutSession = async ({
  amount,
  email,
  name,
  redirect_url,
  // webhook,
  reference_number,
}) => {
  const data = {
    amount,
    email,
    name,
    redirect_url,
    // webhook,
    reference_number,
    currency: "SGD",
    payment_methods: ["paynow_online"],
  };
  const session:IHitPayPaymentReq = await axios.post(
    `${baseUrl}/payment-requests`,
    qs.stringify(data),
    config
  ).then(response=> response.data);
  return session.url;
};
export { createHitPayCheckoutSession };
