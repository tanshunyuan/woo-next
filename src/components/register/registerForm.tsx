import { isUserLoggedIn, setAuth } from "../../utils/user";
import { RegisterSchema } from "../../utils/validator/register";
import MessageAlert from "../message-alert";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { useMutation } from "@apollo/client";
import { v4 } from "uuid";
import REGISTER_CUSTOMER from "../../mutations/user/register";
import { Form, Formik } from "formik";
import InputField from "../form/input-field";
const RegisterForm = () => {
  const initialValues = { username: "", email: "", password: "" };
  const [registerFields, setRegisterFields] = useState(initialValues);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlertBar, setShowAlertBar] = useState(true);
  useEffect(() => {
    const auth = isUserLoggedIn();

    if (!isEmpty(auth)) {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  // Register Mutation.
  const [register, { loading: registerLoading, error: registerError }] =
    useMutation(REGISTER_CUSTOMER, {
      variables: {
        input: {
          clientMutationId: v4(), // Generate a unique id.,
          username: registerFields.username,
          password: registerFields.password,
          email: registerFields.email,
        },
      },
      onCompleted: (data) => {
        // If error.
        if (!isEmpty(registerError)) {
          setErrorMessage(registerError.graphQLErrors[0].message);
        }

        const {
          registerCustomer: { customer },
        } = data;

        handleRegisterSuccess();

        const authData = {
          authToken: customer.jwtAuthToken,
          user: customer,
        };

        setAuth(authData);
        setLoggedIn(true);
      },
      onError: (error) => {
        if (error) {
          if (!isEmpty(error)) {
            setErrorMessage(error.graphQLErrors[0].message);
          }
        }
      },
    });
  const onCloseButtonClick = () => {
    setErrorMessage("");
    setShowAlertBar(false);
  };

  const handleRegisterSuccess = () => {
    // Set form fields value to empty.
    setErrorMessage("");

    // localStorage.setItem( 'registration-success', 'yes' );

    // Add a message.
    setSuccessMessage(
      "Registration Successful! . You will be logged in now..."
    );
  };

  const onSubmit = (values, actions) => {
    setErrorMessage(null);
    const { username, email, password } = values;
    setRegisterFields({ username, password, email });
    register();
  };

  return (
    <div className="register-form col-md-6">
      {/* Title */}

      {/* Error Message */}
      {"" !== errorMessage
        ? showAlertBar && (
            <MessageAlert
              message={errorMessage}
              success={false}
              onCloseButtonClick={onCloseButtonClick}
            />
          )
        : ""}

      {"" !== successMessage
        ? showAlertBar && (
            <MessageAlert
              message={successMessage}
              success={true}
              onCloseButtonClick={onCloseButtonClick}
            />
          )
        : ""}

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values, actions) => onSubmit(values, actions)}
      >
        {({ errors, touched }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              placeholder="John Doe"
              errors={errors}
              touched={touched}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="johndoe@gmail.com"
              errors={errors}
              touched={touched}
            />
            <InputField
              label="Password"
              name="password"
              placeholder="********"
              type="password"
              errors={errors}
              touched={touched}
            />

            <div className="form-group">
              <button
                className="btn btn-dark"
                disabled={registerLoading ? true : false}
                type="submit"
              >
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {registerLoading ? "REgistering la deh" : ""}
    </div>
  );
};
export default RegisterForm;
