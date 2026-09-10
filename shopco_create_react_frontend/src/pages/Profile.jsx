import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}auth/me`, { credentials: "include" }),
      fetch(`${API_BASE_URL}orders`, { credentials: "include" }),
    ])
      .then(async ([userResponse, ordersResponse]) => {
        if (!userResponse.ok) {
          throw new Error("Please sign in to view your profile");
        }
        const userData = await userResponse.json();
        const ordersData = ordersResponse.ok
          ? await ordersResponse.json()
          : { orders: [] };

        setUser(userData.user);
        setForm({
          name: userData.user.name || "",
          phone: userData.user.phone || "",
          address: userData.user.address || "",
        });
        setOrders(ordersData.orders || []);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE_URL}auth/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(data.message);
    if (response.ok) setUser(data.user);
    
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-310 px-4 py-16 font-sans">
        {message || "Loading profile..."}
      </main>
    );
  }

  return (
    <main className="mx-auto mb-25 max-w-310 px-4 py-8 font-sans sm:px-6 lg:px-8">
      <h1 className="font-integral text-3xl uppercase">My Profile</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          className="rounded-2xl border border-black/10 p-6"
          onSubmit={saveProfile}
        >
          <h2 className="text-xl font-bold">Account Information</h2>
          <p className="mt-2 text-sm text-black/60">{user.email}</p>
          {["name", "phone", "address"].map((field) => (
            <label className="mt-5 block text-sm font-bold" key={field}>
              {field[0].toUpperCase() + field.slice(1)}
              <input
                className="mt-2 w-full rounded-full bg-[#f0f0f0] px-4 py-3 font-normal outline-none"
                onChange={(event) =>
                  setForm({ ...form, [field]: event.target.value })
                }
                value={form[field]}
              />
            </label>
          ))}
          <button
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
            type="submit"
          >
            Save Changes
          </button>
          {message && <p className="mt-3 text-sm text-red/60">{message}</p>}
        </form>

        <section className="rounded-2xl border border-black/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Order History</h2>
            <Link className="text-sm underline" to="/orders">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {orders.length ? (
              orders.map((order) => (
                <Link
                  className="flex justify-between rounded-xl bg-[#f0f0f0] p-4 text-sm"
                  key={order._id}
                  to={`/orders/${order._id}`}
                >
                  <span>Order #{order._id.slice(-6)}</span>
                  <strong>${order.totalAmount}</strong>
                </Link>
              ))
            ) : (
              <p className="text-sm text-black/50">No orders yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}