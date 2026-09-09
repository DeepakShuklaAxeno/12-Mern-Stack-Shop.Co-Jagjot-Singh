import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}orders/${orderId}`, { credentials: "include" })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Order not found"))
      )
      .then((data) => setOrder(data.order))
      .catch((error) => setMessage(error.message));
  }, [orderId]);

  if (!order) {
    return (
      <main className="mx-auto max-w-310 px-4 py-16 font-sans">
        {message || "Loading order..."}
      </main>
    );
  }

  return (
    <main className="mx-auto mb-25 max-w-310 px-4 py-8 font-sans sm:px-6 lg:px-8">
      <Link className="text-sm underline" to="/orders">
        ← Orders
      </Link>
      <h1 className="mt-5 font-sans text-3xl uppercase">
        Order #{order._id.slice(-6)}
      </h1>
      <p className="mt-2 text-sm text-black/60">
        {order.orderStatus} · {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 p-5">
        {order.orderItems.map((item) => (
          <div
            className="flex justify-between border-b border-black/10 py-4 last:border-0"
            key={`${item.product}-${item.name}`}
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <strong>${item.price * item.quantity}</strong>
          </div>
        ))}
        <div className="mt-5 flex justify-between text-lg">
          <span>Total</span>
          <strong>${order.totalAmount}</strong>
        </div>
      </div>
    </main>
  );
}