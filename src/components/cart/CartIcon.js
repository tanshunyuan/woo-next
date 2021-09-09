import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Link from "next/link";

const CartIcon = () => {
  const [cart] = useContext(AppContext);
  const productsCount =
    null !== cart && Object.keys(cart).length ? cart.totalProductsCount : "";
  const totalPrice =
    null !== cart && Object.keys(cart).length ? cart.totalProductsPrice : "";

  return (
    <Link href="/cart">
      <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
        Bag
        {productsCount ? <span className="ml-1">({productsCount})</span> : ""}
        {/*{ totalPrice ? <span>{ totalPrice }</span> : '' }*/}
      </a>
    </Link>
  );
};

export default CartIcon;
