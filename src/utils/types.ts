export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  postcode: string;
  email: string;
  phone: string;
  company: string;
  errors: any;
}

export interface ICheckoutInfo {
  billing: ICustomerInfo;
  shipping: ICustomerInfo;
  createAccount: boolean;
  orderNotes: string;
  billingDifferentThanShipping: boolean;
  paymentMethod: string;
}
export interface IOrderInfo {
  billing: ICustomerInfo;
  shipping: ICustomerInfo;
  createAccount: boolean;
  orderNotes: string;
  billingDifferentThanShipping: boolean;
  paymentMethod: string;
}

export interface IWooCommerceCustomerInfo {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  country: string;
  state: string;
  postcode: string;
  email: string;
  phone: string;
  company: string;
}
export interface IWooCommerceOrderData {
  shipping: IWooCommerceCustomerInfo;
  billing: IWooCommerceCustomerInfo;
  payment_method: string;
  payment_method_title: string;
  line_items: ILineItem[];
}

export interface ILineItem {
  product_id: number;
  quantity: number;
}

export interface IImage {
  sourceUrl: string;
  srcSet: string;
  title: string;
  altText: string;
}
export interface IProduct {
  cartKey: string;
  image: IImage;
  name: string;
  price: number;
  productId: number;
  qty: number;
  totalPrice: string;
}
export interface ICart {
  products: IProduct[];
  totalProductsCount: number;
  totalProductsPrice: string;
}
export interface IHitPayWebhookRes{
  payment_id:string;
  payment_request_id:string;
  phone:string;
  amount:string;
  currency:string;
  status: string;
  reference_number:string;
  hmac:string
}
export interface IHitPayPaymentReq {
  allow_repeated_payments: boolean;
  amount: string;
  created_at: Date;
  currency: string;
  email: string;
  email_status: string;
  expiry_date: Date | null;
  id: string;
  name: string;
  payment_methods: string[];
  phone: string;
  purpose: string;
  redirect_url: string;
  reference_number: string;
  send_email: boolean;
  send_sms: boolean;
  sms_status: string;
  status: string;
  updated_at: Date;
  url: string;
  webhook: string;
}
