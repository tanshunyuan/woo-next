import Error from "./Error";

const PaymentModes = ({ input, handleOnChange }) => {
  const { errors, paymentMethod } = input || {};

  return (
    <div className="mt-3">
      <Error errors={errors} fieldName={"paymentMethod"} />
      {/*payment with hitpayapp*/}
      <div className="form-check woo-next-payment-input-container mt-2">
        <label className="form-check-label">
          <input
            onChange={handleOnChange}
            value="hitpayapp"
            className="form-check-input mr-3"
            name="paymentMethod"
            type="radio"
            checked={paymentMethod === "hitpayapp"}
          />
          <span className="woo-next-payment-content">Hit Pay App</span>
        </label>
      </div>
      {/*Stripe*/}
      <div className="form-check woo-next-payment-input-container mt-2">
        <label className="form-check-label">
          <input
            onChange={handleOnChange}
            value="stripe-mode"
            className="form-check-input mr-3"
            name="paymentMethod"
            type="radio"
            checked={"stripe-mode" === paymentMethod}
            checked={paymentMethod === "stripe-mode"}
          />
          <span className="woo-next-payment-content">Stripe</span>
        </label>
      </div>
      {/*	Payment Instructions*/}
      <div className="woo-next-checkout-payment-instructions mt-2">
        Please send a check to Store Name, Store Street, Store Town, Store State
        / County, Store Postcode.
      </div>
    </div>
  );
};

export default PaymentModes;
