import validator from "validator";
import { isEmpty } from "lodash";
interface IRegister {
  username: string;
  email: string;
  password: string;
}
interface IAddErrorAndSanitizedData {
  fieldName: string;
  errorContent: string;
  min: number;
  max: number;
  type: string;
  required: boolean;
}
interface IRegisterReturn{
  sanitizedData:any
  errors:any
  isValid:boolean
}
const validateAndSanitizeRegisterForm = (data: IRegister):IRegisterReturn => {
  let errors = {};
  let sanitizedData = {};

  /**
   * Set the username value equal to an empty string if user has not entered the username, otherwise the Validator.isEmpty() wont work down below.
   * Note that the isEmpty() here is our custom function defined in is-empty.js and
   * Validator.isEmpty() down below comes from validator library.
   * Similarly we do it for for the rest of the fields
   */
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  const addErrorAndSanitizedData = ({
    fieldName,
    errorContent,
    min,
    max,
    type = "",
    required,
  }: IAddErrorAndSanitizedData) => {
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
    fieldName: "username",
    errorContent: "Username",
    min: 2,
    max: 35,
    type: "string",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "email",
    errorContent: "Email",
    min: 11,
    max: 50,
    type: "email",
    required: true,
  });
  addErrorAndSanitizedData({
    fieldName: "password",
    errorContent: "Password",
    min: 2,
    max: 35,
    type: "string",
    required: true,
  });

  return {
    sanitizedData,
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateAndSanitizeRegisterForm;
