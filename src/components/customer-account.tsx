import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { isUserLoggedIn } from "../utils/user";
import Logout from "./customer-account/logout";
import Addresses from "./customer-account/addresses";
import AccountDetails from "./customer-account/account-details";
import Dashboard from "./customer-account/dashboard";
import Orders from "./customer-account/orders";
import { isEmpty } from "lodash";

const TabItemComponent = ({
  icon = "",
  title = "",
  onItemClicked = () => console.error("You passed no action to the component"),
  isActive = false,
}) => {
  return (
    <div className={isActive ? "tabitem" : "tabitem tabitem--inactive"}>
      <button onClick={onItemClicked} style={{ width: "100%" }}>
        <i className={icon} />
        <p className="tabitem__title">{title}</p>
      </button>
    </div>
  );
};
const CustomerAccount = ({ handleLogout }) => {
  const [tabItems, setTabItems] = useState([]);
  const [active, setActive] = useState(1);
  useEffect(() => {
    const authData = isUserLoggedIn();
    if (!isEmpty(authData)) {
      const items = [
        {
          id: 1,
          title: "Dashboard",
          icon: "tabitem__icon tab-dashboard",
          content: <Dashboard authData={authData} />,
        },
        {
          id: 2,
          title: "Orders",
          icon: "tabitem__icon tab-users",
          content: <Orders authData={authData} />,
        },
        {
          id: 3,
          title: "Addresses",
          icon: "tabitem__icon tab-addresses",
          content: <Addresses authData={authData} />,
        },
        {
          id: 4,
          title: "Account Details",
          icon: "tabitem__icon tab-account-details",
          content: <AccountDetails authData={authData} />,
        },
        {
          id: 5,
          title: "Logout",
          icon: "tabitem__icon tab-logout",
          content: "",
        },
      ];
      setTabItems(items);
    }
  }, []);

  return (
    <div>
        <div className="row">
          <div className="account-details-menu col-3">
            {tabItems.map(({ id, icon, title }) =>
              5 === id ? (
                <Logout key={title} handleLogout={handleLogout} />
              ) : (
                <TabItemComponent
                  key={title}
                  icon={icon}
                  title={title}
                  onItemClicked={() => setActive(id)}
                  isActive={active === id}
                />
              )
            )}
          </div>
          <div className="account-details-content card col-9 px-0">
            {tabItems.map(({ id, content }) => {
              return active === id ? <div key={id}>{content}</div> : "";
            })}
          </div>
        </div>
    </div>
  );
};
export default CustomerAccount;
