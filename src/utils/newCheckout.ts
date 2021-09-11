import { isArray, isEmpty } from "lodash";
import { clearTheCart } from "./cart";
import { createHitPayCheckoutSession } from "./hitpayapp";
import {
  ICheckoutInfo,
  IHandleHitPay,
  ILineItem,
  IProduct,
  IWooCommerceOrderData,
} from "./types";
//le flow
//1. User clicks pay and order gets created and gets redirected to payment page
//2. If there is any error navigating to the page, display it
//3. Once redirected, if the user closes the page prematurely. Show user that
//they did not complete the payment
//4. The cart should only be cleared once payment is successful
const handleHitPay = async ({
  checkoutInfo,
  products,
  setRequestError,
  clearCartMutation,
  setIsHitPayOrderProcessing,
  setCreatedOrderData,
  totalPrice,
}: IHandleHitPay) => {
  setIsHitPayOrderProcessing(true);
  const orderData = getWooCommerceOrderData(checkoutInfo, products);
  const createCustomerOrder = await createWooCommerceOrder(
    orderData,
    setRequestError,
    ""
  );
  const cartCleared = await clearTheCart(
    clearCartMutation,
    createCustomerOrder?.error
  );
  setIsHitPayOrderProcessing(false);

  if (isEmpty(createCustomerOrder?.orderId) || cartCleared?.error) {
    console.log("came in");
    setRequestError("Clear cart failed");
    return null;
  }

  // On success show stripe form.
  setCreatedOrderData(createCustomerOrder);
  await createCheckoutSessionAndRedirect(
    checkoutInfo,
    createCustomerOrder?.orderId,
    totalPrice
  );

  return createCustomerOrder;
};

const createCheckoutSessionAndRedirect = async (
  checkoutInfo:ICheckoutInfo,
  orderId: string,
  totalPrice: string
) => {
  const customer_email = checkoutInfo.billingDifferentThanShipping
    ? checkoutInfo.billing.email
    : checkoutInfo.shipping?.email;

  const { firstName, lastName } = checkoutInfo.shipping;
  const name = `${firstName} ${lastName}`;
  const redirect_url = `${window.location.origin}/thank-you`;
  const amount = parseInt(totalPrice.split("$")[1]);

  const sessionUrl = await createHitPayCheckoutSession({
    amount,
    email: customer_email,
    name,
    redirect_url,
    reference_number: orderId,
    phone_number: "12345678",
  });
  try {
    // window.open(sessionUrl, "_self");
    window.open(sessionUrl);
  } catch (error) {
    console.log(error);
  }
};

const getWooCommerceOrderData = (
  order: ICheckoutInfo,
  products: IProduct[]
): IWooCommerceOrderData => {
  // Set the billing Data to shipping, if applicable.
  const billingData = order.billingDifferentThanShipping
    ? order.billing
    : order.shipping;

  // Checkout data.
  return {
    shipping: {
      first_name: order?.shipping?.firstName,
      last_name: order?.shipping?.lastName,
      address_1: order?.shipping?.address1,
      address_2: order?.shipping?.address2,
      city: order?.shipping?.city,
      country: order?.shipping?.country,
      state: order?.shipping?.state,
      postcode: order?.shipping?.postcode,
      email: order?.shipping?.email,
      phone: order?.shipping?.phone,
      company: order?.shipping?.company,
    },
    billing: {
      first_name: billingData?.firstName,
      last_name: billingData?.lastName,
      address_1: billingData?.address1,
      address_2: billingData?.address2,
      city: billingData?.city,
      country: billingData?.country,
      state: billingData?.state,
      postcode: billingData?.postcode,
      email: billingData?.email,
      phone: billingData?.phone,
      company: billingData?.company,
    },
    payment_method: "hitpayapp",
    payment_method_title: "HitPay",
    line_items: getCreateOrderLineItems(products),
  };
};

export const getCreateOrderLineItems = (products: IProduct[]): ILineItem[] => {
  if (isEmpty(products) || !isArray(products)) {
    return [];
  }
  return products.map(({ productId, qty: quantity }) => {
    return {
      quantity,
      product_id: productId,
      // variation_id: '', // @TODO to be added.
    };
  });
};
const createWooCommerceOrder = async (
  orderData: IWooCommerceOrderData,
  setOrderFailedError,
  previousRequestError
) => {
  let response = {
    orderId: null,
    total: "",
    currency: "",
    error: "",
  };

  // Don't proceed if previous request has error.
  if (previousRequestError) {
    response.error = previousRequestError;
    return response;
  }

  setOrderFailedError("");

  try {
    const request = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await request.json();
    if (result.error) {
      response.error = result.error;
      setOrderFailedError(
        "Something went wrong. Order creation failed. Please try again"
      );
    }
    response.orderId = result?.orderId ?? "";
    response.total = result.total ?? "";
    response.currency = result.currency ?? "";
  } catch (error) {
    // @TODO to be handled later.
    console.warn("Handle create order error", error?.message);
  }

  return response;
};
export { handleHitPay };
