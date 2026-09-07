import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function Header() {
  const [promoVisible, setPromoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

      <div className="mx-auto flex min-h-20 max-w-300 items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="p-1 lg:hidden"
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
          <Link aria-label="Shopping cart" className="relative p-1" to="/cart">
            <Icon label="Shopping cart"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L20 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></Icon>
          </Link>
          <Link aria-label="Account" className="p-1" to="/login">
            <Icon label="Account"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Icon>
          </Link>
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
          </div>
        </nav>
      )}
    </header>
  );
}
