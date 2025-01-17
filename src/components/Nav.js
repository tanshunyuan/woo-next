import Link from "next/link";
import CartIcon from "./cart/CartIcon";
import { useState } from "react";

const Nav = () => {
  const [isMenuVisible, setMenuVisibility] = useState(false);

  return (
    <nav className="bg-white p-4">
      <div className="flex items-center justify-between flex-wrap container mx-auto">
        <div className="flex items-center flex-shrink-0 text-black mr-20">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">
            <Link href="/">
              <a className="">WooNext</a>
            </Link>
          </span>
        </div>

        {/*Menu button*/}
        <div className="block lg:hidden">
          <button
            onClick={() => setMenuVisibility(!isMenuVisible)}
            className="flex items-center px-3 py-2 border rounded text-black border-black hover:text-black hover:border-black"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/*MMenu in mobile*/}
        <div
          className={`${
            isMenuVisible ? "max-h-full h-full" : "h-0"
          } w-full overflow-hidden lg:h-full flex-grow lg:flex lg:items-center lg:w-auto`}
        >
          <div className="text-sm font-medium uppercase lg:flex-grow">
            <Link href="/categories">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
                Categories
              </a>
            </Link>
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
                Women
              </a>
            </Link>
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
                Kids
              </a>
            </Link>
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
                Home & Living
              </a>
            </Link>
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
                Offers
              </a>
            </Link>
          </div>

          <div className="text-sm font-medium">
            <Link
              href="/login"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10"
            >
              Register
            </Link>
            <Link
              href="/profile"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10"
            >
              Profile
            </Link>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10"
            >
              Wishlist
            </a>
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
