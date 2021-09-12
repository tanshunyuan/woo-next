import { useQuery } from "@apollo/client";
import GET_SHIPPING_METHODS from "../../queries/get-shipping-methods";
import client from "../ApolloClient";

const Shipping = () => {
  const { data } = useQuery(GET_SHIPPING_METHODS);
  const shippingMethods = data.shippingMethods.nodes;

  return (
    <div>
      {shippingMethods.map((methods, index) => {
        return (
          <div className="field" key={index}>
            <label>{methods.title}</label>
            <input type="radio" value={methods.id} />
          </div>
        );
      })}
    </div>
  );
};
export default Shipping;
