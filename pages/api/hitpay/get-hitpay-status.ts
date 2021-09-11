import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const baseUrl = "https://api.sandbox.hit-pay.com/v1";
const config = {
  headers: {
    // RMB TO CHANGE
    "X-BUSINESS-API-KEY": process.env.NEXT_PUBLIC_HITPAYAPP_API_KEY,
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { reference_id } = req.query;
    const paymentStatus = await axios
      .get(`${baseUrl}/payment-requests/${reference_id}`, config)
      .then((response) => response.data)
      .catch((error) => console.log(error));
    res.status(200).json(paymentStatus);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
