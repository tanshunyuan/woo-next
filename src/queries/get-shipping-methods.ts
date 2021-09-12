import { gql } from "@apollo/client";
const GET_SHIPPING_METHODS = gql`
  query {
    shippingMethods {
      nodes {
        id
        description
        databaseId
        title
      }
    }
  }
`;

export default GET_SHIPPING_METHODS;
