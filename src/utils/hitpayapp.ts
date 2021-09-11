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
  reference_number,
  phone_number,
}) => {
  const data = {
    amount,
    email,
    name,
    redirect_url,
    // webhook:'http://localhost:3000/api/hitpay/hitpay-web-hook',
    webhook: "https://9b41-121-7-44-127.ngrok.io/api/hitpay/hitpay-web-hook",
    reference_number,
    currency: "SGD",
    payment_methods: ["paynow_online"],
    phone: phone_number,
  };
  const session: IHitPayPaymentReq = await axios
    .post(`${baseUrl}/payment-requests`, qs.stringify(data), config)
    .then((response) => {
      console.log("response ==> ", response);
      return response.data;
    });
  return session.url;
};
export { createHitPayCheckoutSession };
