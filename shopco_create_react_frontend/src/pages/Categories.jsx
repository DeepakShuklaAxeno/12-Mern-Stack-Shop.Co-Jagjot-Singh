import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";
export default function Categories() {
  const [categories, setCategories] = useState([]); const [error, setError] = useState("");
  useEffect(() => { fetch(`${API_BASE_URL}categories`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load categories"))).then((data) => setCategories(data.categories || [])).catch((requestError) => setError(requestError.message)); }, []);
  return <main className="mx-auto max-w-310 px-4 py-8 font-sans sm:px-6 lg:px-8"><h1 className="font-integral text-3xl uppercase sm:text-4xl">Categories</h1>{error && <p className="mt-5 text-sm text-red-600">{error}</p>}<div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{categories.map((category) => <Link className="min-h-36 rounded-2xl bg-[#f0f0f0] p-5 transition hover:bg-black hover:text-white" key={category._id} to={`/products?category=${category._id}`}><h2 className="text-lg font-bold">{category.name}</h2><p className="mt-2 text-sm opacity-60">{category.description}</p></Link>)}</div></main>;
}
