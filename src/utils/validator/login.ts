import validator from "validator";
import * as Yup from 'yup';
import { isEmpty } from "lodash";
interface ILogin {
  username: string;
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
interface ILoginReturn{
  sanitizedData:any
  errors:any
  isValid:boolean
}

 export const LoginSchema = Yup.object().shape({
   username: Yup.string()
     .min(2, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
   password: Yup.string()
     .min(1, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
 });

const validateAndSanitizeLoginForm = (data:ILogin):ILoginReturn => {
  let errors = {};
  let sanitizedData = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  const addErrorAndSanitizedData = ({
    fieldName,
    errorContent,
    min,
    max,
    type = "",
    required
  }) => {
    /**
     * Please note that this isEmpty() belongs to validator and not our custom function defined above.
     *
     * Check for error and if there is no error then sanitize data.
     */
    if (!validator.isLength(data[fieldName], { min, max })) {
      errors[fieldName] = `${errorContent} must be ${min} to ${max} characters`;
    }

    if (required && validator.isEmpty(data[fieldName])) {
      errors[fieldName] = `${errorContent} is required`;
    }

    // If no errors
    if (!errors[fieldName]) {
      sanitizedData[fieldName] = validator.trim(data[fieldName]);
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

export default validateAndSanitizeLoginForm;
