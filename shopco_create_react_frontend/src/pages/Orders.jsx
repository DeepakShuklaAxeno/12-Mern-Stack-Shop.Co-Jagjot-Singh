import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}orders`, { credentials: "include" })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Please sign in to view orders"))
      )
      .then((data) => setOrders(data.orders || []))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <main className="mx-auto mb-25 max-w-310 px-4 py-8 font-sans sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-integral text-3xl uppercase">Orders</h1>
        <Link className="text-sm underline" to="/profile">
          Profile
        </Link>
      </div>

      {message && <p className="mt-5 text-sm text-red-600">{message}</p>}

      <div className="mt-8 space-y-3">
        {orders.map((order) => (
          <Link
            className="flex flex-wrap justify-between gap-3 rounded-2xl border border-black/10 p-5 hover:bg-[#f0f0f0]"
            key={order._id}
            to={`/orders/${order._id}`}
          >
            <span>Order #{order._id.slice(-6)}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            <span>{order.orderStatus}</span>
            <strong>${order.totalAmount}</strong>
          </Link>
        ))}
        {!orders.length && !message && (
          <p className="rounded-2xl border border-black/10 p-8 text-center text-black/50">
            No orders yet.
          </p>
        )}
      </div>
    </main>
  );
}