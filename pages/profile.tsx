import Layout from "../src/components/Layout";
import CustomerAccount from "../src/components/customer-account";
import React, { useState, useEffect } from "react";
import { isUserLoggedIn, logOut } from "../src/utils/user";
import { isEmpty } from 'lodash';
const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const auth = isUserLoggedIn();

    if (!isEmpty(auth)) {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  const handleLogout = () => {
    logOut();
    setLoggedIn(false);
  };
  return (
    <Layout>
      {loggedIn && (
        <div className="account-details container py-5">
          <CustomerAccount handleLogout={handleLogout} />
        </div>
      )}
    </Layout>
  );
};
export default Profile;
