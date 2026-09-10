import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Products() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const page = Number(params.get("page") || 1);
  const sort = params.get("sort") || "newest";
  const active = Object.fromEntries(
    ["category", "minPrice", "maxPrice", "color", "size", "availability"].map(
      (key) => [key, params.get(key) || ""]
    )
  );
  const { category, minPrice, maxPrice, color, size, availability } = active;

  useEffect(() => {
    fetch(`${API_BASE_URL}categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "9",
          sort,
        });
        Object.entries({
          category,
          minPrice,
          maxPrice,
          color,
          size,
          availability,
        }).forEach(([key, value]) => {
          if (value) query.set(key, value);
        });
        if (search) query.set("search", search);

        const response = await fetch(`${API_BASE_URL}products?${query}`);
        if (!response.ok) throw new Error("Unable to load products");
        const data = await response.json();
        setProducts(data.products || []);
        setTotal(data.pagination?.total || 0);
        setError("");
      } catch (requestError) {
        setProducts([]);
        setTotal(0);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [page, search, sort, category, minPrice, maxPrice, color, size, availability]);

  const pages = Math.max(1, Math.ceil(total / 9));
  const update = (key, value) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      value ? next.set(key, value) : next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });

  return (
    <main className="bg-white mb-25 text-black">
      <div className="mx-auto max-w-310 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2 font-sans text-xs text-black/50">
          <Link to="/">Home</Link>
          <Chevron />
          <span>Casual</span>
        </div>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-integral text-3xl uppercase sm:text-4xl">Casual</h1>
          <p className="hidden font-sans text-xs text-black/50 sm:block">
            Showing {Math.min((page - 1) * 9 + 1, total)}-
            {Math.min(page * 9, total)} of {total} Products
          </p>
          <label className="flex items-center gap-2 font-sans text-xs">
            Sort by:
            <select
              className="bg-transparent font-bold outline-none"
              onChange={(event) => update("sort", event.target.value)}
              value={sort}
            >
              <option value="newest">Most Popular</option>
              <option value="price-asc">Price: Low</option>
              <option value="price-desc">Price: High</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {filtersOpen && (
            <>
              <button
                aria-label="Close filter overlay"
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={() => setFiltersOpen(false)}
                type="button"
              />
              <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[390px] lg:hidden">
                <Filters
                  active={active}
                  categories={categories}
                  onClose={() => setFiltersOpen(false)}
                  update={update}
                />
              </div>
            </>
          )}

          <div className="hidden lg:block">
            <Filters
              active={active}
              categories={categories}
              onClose={() => setFiltersOpen(false)}
              update={update}
            />
          </div>

          <section className="min-w-0">
            <button
              className="mb-4 flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-sans text-xs lg:hidden"
              onClick={() => setFiltersOpen(true)}
              type="button"
            >
              Filters <span>⌄</span>
            </button>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 font-sans text-sm text-red-600">
                {error}
              </p>
            )}

            {loading ? (
              <div className="py-20 text-center font-sans text-sm text-black/50">
                Loading products...
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="py-20 text-center font-sans text-sm text-black/50">
                No products match these filters.
              </p>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-5 font-sans text-xs">
              <button
                className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-30"
                disabled={page <= 1}
                onClick={() => update("page", String(page - 1))}
                type="button"
              >
                ← Previous
              </button>

              <div className="hidden gap-4 sm:flex">
                {Array.from({ length: Math.min(pages, 5) }, (_, index) => (
                  <button
                    className={
                      page === index + 1
                        ? "rounded-lg bg-[#f0f0f0] px-3 py-2"
                        : "px-2 py-2 text-black/50"
                    }
                    key={index}
                    onClick={() => update("page", String(index + 1))}
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-30"
                disabled={page >= pages}
                onClick={() => update("page", String(page + 1))}
                type="button"
              >
                Next →
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


  