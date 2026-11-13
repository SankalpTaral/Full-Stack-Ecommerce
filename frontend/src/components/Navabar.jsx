
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingBag, UserRound, Menu } from "lucide-react";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive
        ? "text-black font-semibold"
        : "text-gray-500 hover:text-black"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[#faf9f6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-[0.25em] text-black">
          LUXORA
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-9 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>

          <NavLink to="/new-arrivals" className={navLinkClass}>
            New Arrivals
          </NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 text-gray-800">
          <button aria-label="Search" className="transition hover:text-gray-400">
            <Search size={21} strokeWidth={1.6} />
          </button>

          <Link to="/cart" aria-label="Shopping cart">
            <ShoppingBag size={21} strokeWidth={1.6} />
          </Link>

          <Link to="/profile" aria-label="Profile">
            <UserRound size={21} strokeWidth={1.6} />
          </Link>

          <button aria-label="Menu" className="md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Announcement bar */}
      <div className="bg-black py-2 text-center text-[10px] tracking-[0.2em] text-white">
        ELEVATE YOUR EVERYDAY · DISCOVER LUXORA
      </div>
    </nav>
  );
}

export default Navbar;
