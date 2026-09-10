import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";
import QuantitySelector from "../components/QuantitySelector";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  useEffect(() => {
    fetch(`${API_BASE_URL}cart`, { credentials: "include" })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Sign in to load your cart"))
      )
      .then((data) => setItems(data.cart.cartItems || []))
      .catch((error) => setMessage(error.message));
  }, []);

  const updateQuantity = async (item, quantity) => {
    const response = await fetch(`${API_BASE_URL}cart/items/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    if (response.ok) setItems((await response.json()).cart.cartItems);
  };

  const removeItem = async (item) => {
    const response = await fetch(`${API_BASE_URL}cart/items/${item._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) setItems((await response.json()).cart.cartItems);
  };

  const applyCoupon = async (code) => {
    const response = await fetch(`${API_BASE_URL}cart/coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (response.ok) {
      setItems(data.cart.cartItems);
      setMessage("Coupon applied");
    } else {
      setMessage(data.message);
    }
  };

  const submitCheckout = async (event) => {
    event.preventDefault();
    setCheckoutLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Checkout failed");
      }
      navigate(`/orders/${data.order._id}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.product?.sellingPrice || 0) * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.2);

  return (
    <main className="bg-white px-4 mb-25 pb-16 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-310">
        <nav className="flex gap-2 py-5 font-sans text-xs text-black/50">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Cart</span>
        </nav>
        <h1 className="font-integral text-3xl uppercase sm:text-4xl">
          Your Cart
        </h1>
        {message && <p className="mt-3 text-sm text-green/50">{message}</p>}
        {!items.length ? (
          <p className="mt-8 rounded-2xl border border-black/10 p-8 text-center font-sans text-black/60">
            Your cart is empty.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.85fr]">
            <section className="rounded-2xl border border-black/10 p-4 sm:p-5">
              {items.map((item) => (
                <article
                  className="flex gap-3 border-b border-black/10 py-4 first:pt-0 last:border-0 last:pb-0"
                  key={item._id}
                >
                  <div className="size-24 rounded-xl bg-[#f0eeed] sm:size-32">
                    {item.product?.images?.[0] && (
                      <img
                        alt={item.product.name}
                        className="size-full rounded-xl object-cover"
                        src={item.product.images[0]}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h2 className="truncate font-sans font-bold">
                          {item.product?.name}
                        </h2>
                        <p className="font-sans text-xs text-black/60">
                          Size: {item.size || "Not selected"}
                        </p>
                        <p className="font-sans text-xs text-black/60">
                          Color: {item.color || "Not selected"}
                        </p>
                      </div>
                      <button
                        className="text-sm text-red-500"
                        onClick={() => removeItem(item)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <strong className="font-sans text-lg">
                        ${item.product?.sellingPrice}
                      </strong>
                      <QuantitySelector
                        max={item.product?.stockQuantity || 99}
                        onChange={(quantity) => updateQuantity(item, quantity)}
                        value={item.quantity}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <div>
              <OrderSummary
                discount={discount}
                onApplyCoupon={applyCoupon}
                onCheckout={() => setCheckoutOpen(true)}
                subtotal={subtotal}
              />
              {checkoutOpen && (
                <form
                  className="mt-5 rounded-2xl border border-black/10 p-5 font-sans sm:p-6"
                  onSubmit={submitCheckout}
                >
                  <h2 className="text-xl font-bold">Shipping details</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {Object.keys(shippingAddress).map((field) => (
                      <label
                        className={field === "street" ? "sm:col-span-2" : ""}
                        key={field}
                      >
                        <span className="mb-1 block text-xs font-medium capitalize text-black/60">
                          {field === "postalCode" ? "Postal code" : field}
                        </span>
                        <input
                          className="w-full rounded-full bg-[#f0f0f0] px-4 py-3 text-sm outline-none"
                          onChange={(event) =>
                            setShippingAddress({
                              ...shippingAddress,
                              [field]: event.target.value,
                            })
                          }
                          required
                          value={shippingAddress[field]}
                        />
                      </label>
                    ))}
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1 block text-xs font-medium text-black/60">
                      Payment method
                    </span>
                    <select
                      className="w-full rounded-full bg-[#f0f0f0] px-4 py-3 text-sm outline-none"
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      value={paymentMethod}
                    >
                      <option value="credit_card">Credit card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank transfer</option>
                    </select>
                  </label>
                  <button
                    className="mt-5 w-full rounded-full bg-black py-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={checkoutLoading}
                    type="submit"
                  >
                    {checkoutLoading ? "Placing order..." : "Place order"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      
    </main>
  );
}