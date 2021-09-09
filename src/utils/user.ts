import { isEmpty } from "lodash";
const isClientSide = typeof window !== undefined;

export const isUserLoggedIn = () => {
  let authData = null;

  if (isClientSide) {
    authData = JSON.parse(localStorage.getItem("auth"));
  }
  return authData;
};

export const logOut = () => {
  localStorage.removeItem("auth");
};

export const setAuth = (authData) => {
  localStorage.setItem("auth", JSON.stringify(authData));
};

/**
 * Check if user is logged in.
 *
 * @return {object} Auth Object containing token and user data, false on failure.
 */
export const isUserValidated = () => {
  let userLoggedInData = "";

  if (isClientSide) {
    let authTokenData:any = localStorage.getItem("auth");

    if (!isEmpty(authTokenData)) {
      authTokenData = JSON.parse(authTokenData);

      if (!isEmpty(authTokenData.authToken)) {
        userLoggedInData = authTokenData;
      }
    }
  }

  return userLoggedInData;
};
