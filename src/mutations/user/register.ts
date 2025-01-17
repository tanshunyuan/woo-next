import { gql } from "@apollo/client";

const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
      customer {
        id
        username
        email
        firstName
        lastName
        jwtAuthToken
      }
    }
  }
`;

export default REGISTER_CUSTOMER;
