import { isUserLoggedIn, logOut, setAuth } from "../../utils/user";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { useMutation } from "@apollo/client";
import LOGIN from "../../mutations/user/login";
import { v4 } from "uuid";
import { sanitize } from "../../functions";
import { Formik, Form } from "formik";
import { LoginSchema } from "../../utils/validator/login";
import InputField from "../../components/form/input-field";

const LoginForm = () => {
  const initialValues = { username: "", password: "" };
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginFields, setLoginFields] = useState(initialValues);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const auth = isUserLoggedIn();

    if (!isEmpty(auth)) {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  // Login Mutation.
  const [login, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN,
    {
      variables: {
        input: {
          clientMutationId: v4(), // Generate a unique id.,
          username: loginFields.username,
          password: loginFields.password,
        },
      },
      onCompleted: (data) => {
        // If error.
        if (!isEmpty(loginError)) {
          setErrorMessage(loginError.graphQLErrors[0].message);
        }

        const { login } = data;
        const authData = {
          authToken: login.authToken,
          user: login.user,
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
    }
  );

  const onSubmit = (values, actions) => {
    setErrorMessage(null);
    const { username, password } = values;
    setLoginFields({ username, password });
    login();
  };

  return (
    <div className="login-form col-md-6">
      <pre>{JSON.stringify(loggedIn)}</pre>
      <h4 className="mb-4">Login</h4>
      {!isEmpty(errorMessage) && (
        <div
          className="alert alert-danger"
          dangerouslySetInnerHTML={{ __html: sanitize(errorMessage) }}
        />
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={(values, actions) => onSubmit(values, actions)}
      >
        {({ errors, touched }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              placeholder="Username"
              errors={errors}
              touched={touched}
            />
            <InputField
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
              errors={errors}
              touched={touched}
            />

            <button type="submit" className="m-4">
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {loginLoading && "loggin in la sial"}
    </div>
  );
};
export default LoginForm;
