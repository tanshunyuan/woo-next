import validator from "validator";
import { isEmpty } from "lodash";
interface ICheckout {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  createAccount: boolean;
  orderNotes: string;
}
interface IAddErrorAndSanitizedData {
  fieldName: string;
  errorContent: string;
  min: number;
  max: number;
  type: string;
  required: boolean;
}
interface ICheckoutReturn {
  sanitizedData: any;
  errors: any;
  isValid: boolean;
}

const validateAndSanitizeCheckoutForm = (data: ICheckout, hasStates = true) => {
  let errors = {};
  let sanitizedData:any  = {};

  /**
   * Set the firstName value equal to an empty string if user has not entered the firstName, otherwise the Validator.isEmpty() wont work down below.
   * Note that the isEmpty() here is our custom function defined in is-empty.js and
   * Validator.isEmpty() down below comes from validator library.
   * Similarly we do it for for the rest of the fields
   */
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.address1 = !isEmpty(data.address1) ? data.address1 : "";
  data.address2 = !isEmpty(data.address2) ? data.address2 : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.postcode = !isEmpty(data.postcode) ? data.postcode : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.createAccount = !isEmpty(data.createAccount) ? data.createAccount : false;
  data.orderNotes = !isEmpty(data.orderNotes) ? data.orderNotes : "";
  // data.paymentMethod = ( ! isEmpty( data.paymentMethod ) ) ? data.paymentMethod : '';

  const addErrorAndSanitizedData = ({
    fieldName,
    errorContent,
    min,
    max,
    type = "",
    required,
  }:IAddErrorAndSanitizedData) => {
    /**
     * Please note that this isEmpty() belongs to validator and not our custom function defined above.
     *
     * Check for error and if there is no error then sanitize data.
     */
    if (!validator.isLength(data[fieldName], { min, max })) {
      errors[fieldName] = `${errorContent} must be ${min} to ${max} characters`;
    }

    if ("email" === type && !validator.isEmail(data[fieldName])) {
      errors[fieldName] = `${errorContent} is not valid`;
    }

    if ("phone" === type && !validator.isMobilePhone(data[fieldName])) {
      errors[fieldName] = `${errorContent} is not valid`;
    }

    if (required && validator.isEmpty(data[fieldName])) {
      errors[fieldName] = `${errorContent} is required`;
    }

    // If no errors
    if (!errors[fieldName]) {
      sanitizedData[fieldName] = validator.trim(data[fieldName]);
      sanitizedData[fieldName] =
        "email" === type
          ? validator.normalizeEmail(sanitizedData[fieldName])
          : sanitizedData[fieldName];
      sanitizedData[fieldName] = validator.escape(sanitizedData[fieldName]);
    }
  };

  addErrorAndSanitizedData({
    fieldName: "firstName",
    errorContent: "First name",
    min: 2,
    max: 35,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "lastName",
    errorContent: "Last name",
    min: 2,
    max: 35,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "company",
    errorContent: "Company Name",
    min: 0,
    max: 35,
    type: "string",
    required: false,
  });
  addErrorAndSanitizedData({
    fieldName: "country",
    errorContent: "Country name",
    min: 2,
    max: 35,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "address1",
    errorContent: "Street Address Line 1",
    min: 12,
    max: 100,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "address2",
    errorContent: "",
    min: 0,
    max: 254,
    type: "string",
    required: false,
  });
  addErrorAndSanitizedData({
    fieldName: "city",
    errorContent: "City field",
    min: 3,
    max: 35,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "state",
    errorContent: "State/County",
    min: 0,
    max: 254,
    type: "string",
    required: hasStates,
  });
  addErrorAndSanitizedData({
    fieldName: "postcode",
    errorContent: "Postal Code",
    min: 2,
    max: 10,
    type: "postcode",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "phone",
    errorContent: "Phone Number",
    min: 10,
    max: 15,
    type: "phone",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "email",
    errorContent: "Email",
    min: 11,
    max: 254,
    type: "email",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "orderNotes",
    errorContent: "",
    min: 0,
    max: 254,
    type: "string",
    required: false,
  });

  // The data.createAccount is a boolean value.
  sanitizedData.createAccount = data.createAccount;
  // @TODO Payment mode error to be handled later.
  // addErrorAndSanitizedData( 'paymentMethod', 'Payment mode field', 2, 50, 'string', false );

  return {
    sanitizedData,
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateAndSanitizeCheckoutForm;
