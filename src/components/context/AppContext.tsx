import React, { useState, useEffect } from "react";
import { ICart } from "../../utils/types";
export const AppContext = React.createContext([{}, () => {}]);

export const AppProvider = (props) => {
  const [cart, setCart] = useState<ICart | null | string>(null);

  useEffect(() => {
    // @TODO Will add option to show the cart with localStorage later.
    if (process.browser) {
      let cartData = localStorage.getItem("woo-next-cart");
      cartData = null !== cartData ? JSON.parse(cartData) : "";
      setCart(cartData);
    }
  }, []);

  return (
    <AppContext.Provider value={[cart, setCart]}>
      {props.children}
    </AppContext.Provider>
  );
};
