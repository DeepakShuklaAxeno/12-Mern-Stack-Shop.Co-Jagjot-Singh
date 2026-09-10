import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

function Icon({ children, label, className = "size-5" }) {
  return (
    <svg
      aria-label={label}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
    >
      {children}
    </svg>
  );
}

export default function Header({ cartCount = 0 }) {
  const [promoVisible, setPromoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(cartCount);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;

    function refreshCart() {
      fetch(`${API_BASE_URL}cart`, { credentials: "include" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          const items = data?.cart?.cartItems || [];
          const count = items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
          );

          if (active) setCartItemsCount(count);
        })
        .catch(() => {
          if (active) setCartItemsCount(0);
        });
    }

    fetch(`${API_BASE_URL}auth/me`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active) setUser(data?.user || null);
      })
      .catch(() => {
        if (active) setUser(null);
      });


    refreshCart();
    window.addEventListener("cart-updated", refreshCart);

    fetch(`${API_BASE_URL}cart`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const items = data?.cart?.cartItems || [];

        const count = items.reduce(
          (total, item) => total + Number(item.quantity || 0),
          0
        );

        setCartItemsCount(count);
      })
      .catch(() => setCartItemsCount(0));


    return () => {
      active = false;
      window.removeEventListener("cart-updated", refreshCart);
    };
  }, [location.pathname]);

  async function handleLogout() {
    await fetch(`${API_BASE_URL}auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="w-full bg-white text-black">
      {promoVisible && (
        <div className="relative flex min-h-9 items-center justify-center bg-black px-10 py-2 text-center font-sans text-xs text-white sm:text-sm">
          <p>
            Sign up and get 20% off your first order. {" "}
            <Link className="font-bold underline underline-offset-2" to="/signup">
              Sign Up Now
            </Link>
          </p>
          <button
            aria-label="Close promotion"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-60"
            onClick={() => setPromoVisible(false)}
            type="button"
          >
            <Icon label="Close" className="size-4">
              <path d="m6 6 12 12M18 6 6 18" />
            </Icon>
          </button>
        </div>
      )}

      <div className="page-gutter mx-auto flex min-h-20 max-w-300 items-center gap-4 lg:gap-8 ">
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="p-1 lg:hidden "
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <Icon label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </Icon>
        </button>

        <Link className="shrink-0 font-integral text-2xl font-bold tracking-tight sm:text-3xl" to="/">
          SHOP.CO
        </Link>

        <nav className="hidden items-center gap-6 font-sans text-sm lg:flex" aria-label="Main navigation">
          <Link className="transition-opacity hover:opacity-60" to="/products">Shop</Link>
          <Link className="transition-opacity hover:opacity-60" to="/categories">Categories</Link>
          <Link className="transition-opacity hover:opacity-60" to="/products?sort=newest">New Arrivals</Link>
          <Link className="transition-opacity hover:opacity-60" to="/products?sort=price-asc">On Sale</Link>
          {user && <Link className="transition-opacity hover:opacity-60" to="/orders">Orders</Link>}
          {user?.role === "admin" && <Link className="transition-opacity hover:opacity-60" to="/admin">Admin</Link>}
        </nav>

        <form className="hidden min-w-0 flex-1 lg:block" onSubmit={submitSearch} role="search">
          <label className="flex h-11 items-center gap-3 rounded-full bg-[#f0f0f0] px-4 text-black/40" htmlFor="desktop-search">
            <Icon label="Search"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
            <input
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-black outline-none placeholder:text-black/40"
              id="desktop-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for products..."
              type="search"
              value={search}
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <button aria-label="Search" className="p-1 lg:hidden" onClick={() => setSearchOpen((open) => !open)} type="button">
            <Icon label="Search"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
          </button>
          <Link
            aria-label={`Shopping cart with ${cartItemsCount} items`}
            className="relative p-1"
            to="/cart"
          >
            <Icon label="Shopping cart">
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L20 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
            </Icon>

            {cartItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link aria-label={user ? "Profile" : "Account"} className="p-1" to={user ? "/profile" : "/login"}>
            <Icon label="Account"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Icon>
          </Link>
          {user && <button className="hidden font-sans text-sm underline underline-offset-2 lg:block " onClick={handleLogout} type="button">Log out</button>}
        </div>
      </div>

      {searchOpen && (
        <form className="border-t border-black/5 px-4 py-3 lg:hidden" onSubmit={submitSearch} role="search">
          <label className="flex h-11 items-center gap-3 rounded-full bg-[#f0f0f0] px-4 text-black/40" htmlFor="mobile-search">
            <Icon label="Search"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-black outline-none placeholder:text-black/40"
              id="mobile-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for products..."
              type="search"
              value={search}
            />
          </label>
        </form>
      )}

      {menuOpen && (
        <nav className="border-t border-black/10 px-4 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-4 font-sans text-base">
            <Link onClick={() => setMenuOpen(false)} to="/products">Shop</Link>
            <Link onClick={() => setMenuOpen(false)} to="/categories">Categories</Link>
            <Link onClick={() => setMenuOpen(false)} to="/products?sort=newest">New Arrivals</Link>
            <Link onClick={() => setMenuOpen(false)} to="/products?sort=price-asc">On Sale</Link>
            {user && <Link onClick={() => setMenuOpen(false)} to="/orders">Orders</Link>}
            {user && <Link onClick={() => setMenuOpen(false)} to="/profile">Profile</Link>}
            {user?.role === "admin" && <Link onClick={() => setMenuOpen(false)} to="/admin">Admin Dashboard</Link>}
            {user ? <button className="text-left transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 shadow-sm hover:shadow-md" onClick={handleLogout} type="button">Log out</button> : <Link onClick={() => setMenuOpen(false)} to="/login">Log in</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
