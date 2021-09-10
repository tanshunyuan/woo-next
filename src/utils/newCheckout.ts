import { isArray, isEmpty } from "lodash";
import { clearTheCart } from "./cart";
import { createHitPayCheckoutSession } from "./hitpayapp";
import {
  ILineItem,
  IOrderInfo,
  IProduct,
  IWooCommerceOrderData,
} from "./types";
const handleHitPayApp = async ({
  customerInfo,
  products,
  setRequestError,
  clearCartMutation,
  setIsHitPayOrderProcessing,
  setCreatedOrderData,
  totalPrice,
}) => {
  setIsHitPayOrderProcessing(true);
  const orderData = getCreateOrderData(customerInfo, products);
  const createCustomerOrder = await createTheOrder(
    orderData,
    setRequestError,
    ""
  );
  // const cartCleared = await clearTheCart(
  //   clearCartMutation,
  //   createCustomerOrder?.error
  // );
  setIsHitPayOrderProcessing(false);

  // if (isEmpty(createCustomerOrder?.orderId) || cartCleared?.error) {
  //   console.log("came in");
  //   setRequestError("Clear cart failed");
  //   return null;
  // }

  // On success show stripe form.
  setCreatedOrderData(createCustomerOrder);
  await createCheckoutSessionAndRedirect(
    products,
    customerInfo,
    createCustomerOrder?.orderId,
    totalPrice
  );

  return createCustomerOrder;
};

const createCheckoutSessionAndRedirect = async (
  products,
  input,
  orderId: string,
  totalPrice
) => {
  const customer_email = input.billingDifferentThanShipping
    ? input?.billing?.email
    : input?.shipping?.email;
  // const redirect_url = `${window.location.origin}/thank-you?session_id{CHECKOUT_SESSION_ID}&order_id=${orderId}`;
  const redirect_url = `${window.location.origin}/thank-you`;
  totalPrice = parseInt(totalPrice.split("$")[1]);

  const sessionData = {
    redirect_url,
    cancel_url: window.location.href,
    customer_email,
    line_items: getStripeLineItems(products),
    metadata: getMetaData(input, orderId),
    payment_method_types: ["card"],
    mode: "payment",
    totalPrice
  };
  console.log(sessionData);
  const sessionUrl = await createHitPayCheckoutSession({
    amount: totalPrice,
    email: customer_email,
    name: "something",
    redirect_url,
    reference_number: orderId,
  });
  try {
    window.open(sessionUrl)
  }catch(error){
    console.log(error)
  }
  //This is where le custom integration needs to come in
  // const session = await createCheckoutSession(sessionData)
  // try {
  //     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  //     if (stripe) {
  //         stripe.redirectToCheckout({ sessionId: session.id });
  //     }
  // } catch (error) {
  //     console.log( error );
  // }
};

const getStripeLineItems = (products) => {
  if (isEmpty(products) && !isArray(products)) {
    return [];
  }

  return products.map((product) => {
    return {
      quantity: product?.qty ?? 0,
      name: product?.name ?? "",
      images: [product?.image?.sourceUrl ?? ""],
      amount: Math.round(product?.price * 100),
      currency: "sgd",
    };
  });
};

/**
 * Get meta data.
 *
 * @param input
 * @param {String} orderId Order Id.
 *
 * @returns {{lineItems: string, shipping: string, orderId, billing: string}}
 */
export const getMetaData = (input, orderId) => {
  return {
    billing: JSON.stringify(input?.billing),
    shipping: JSON.stringify(
      input.billingDifferentThanShipping
        ? input?.billing?.email
        : input?.shipping?.email
    ),
    orderId,
  };

  // @TODO
  // if ( customerId ) {
  //     metadata.customerId = customerId;
  // }
};
export const getCreateOrderData = (
  order: IOrderInfo,
  products: IProduct[]
): IWooCommerceOrderData => {
  console.log(order);
  console.log(products);
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
export const createTheOrder = async (
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
export { handleHitPayApp };
