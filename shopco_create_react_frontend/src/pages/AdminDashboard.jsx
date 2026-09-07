import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";
export default function AdminDashboard() {
    const [data, setData] = useState(null); const [error, setError] = useState("");
    useEffect(() => { fetch(`${API_BASE_URL}admin/dashboard`, { credentials: "include" }).then((response) => response.ok ? response.json() : Promise.reject(new Error("Admin access required"))).then(setData).catch((requestError) => setError(requestError.message)); }, []);
    if (error) return <main className="mx-auto max-w-310 px-4 py-16 font-sans text-red-600">{error}</main>;
    return <main className="mx-auto max-w-310 px-4 py-8 font-sans sm:px-6 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-integral text-3xl uppercase">Admin Dashboard</h1><Link className="rounded-full bg-black px-5 py-3 text-sm text-white" to="/admin/products/new">Add Product</Link></div>{data ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{[["Products", data.products], ["Categories", data.categories], ["Users", data.users], ["Orders", data.orders], ["Out of Stock", data.outOfStock], ["Low Stock", data.lowStock]].map(([label, value]) => <div className="rounded-2xl border border-black/10 p-5" key={label}><p className="text-sm text-black/50">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></div>)}</div> : <p className="mt-8">Loading dashboard...</p>}<div className="mt-8 flex gap-3"><Link className="rounded-full border border-black/10 px-5 py-3 text-sm" to="/products">View Store</Link><Link className="rounded-full border border-black/10 px-5 py-3 text-sm" to="/admin/products/new">Manage Products</Link></div></main>;
}
