import { useState } from "react";

export default function OrderSummary({ subtotal = 0, discount = 0, onCheckout, onApplyCoupon, checkoutLabel = "Go to Checkout" }) {
  const [coupon, setCoupon] = useState("");
  const total = Math.max(0, subtotal - discount);
  return (
    <aside className="rounded-2xl border border-black/10 p-5 font-sans sm:p-6">
      <h2 className="text-xl font-bold">Order Summary</h2>
      <dl className="mt-5 space-y-4 text-sm text-black/60"><div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold text-black">${subtotal}</dd></div><div className="flex justify-between"><dt>Discount (-20%)</dt><dd className="font-bold text-red-500">-${discount}</dd></div><div className="flex justify-between"><dt>Delivery Fee</dt><dd className="font-bold text-black">$15</dd></div></dl>
      <div className="my-5 border-t border-black/10 pt-5"><div className="flex justify-between"><span>Total</span><strong className="text-xl">${total}</strong></div></div>
      <div className="flex gap-2"><input className="min-w-0 flex-1 rounded-full bg-[#f0f0f0] px-4 py-3 text-xs outline-none" onChange={(event) => setCoupon(event.target.value)} placeholder="Add promo code" value={coupon} /><button className="rounded-full bg-black px-5 py-3 text-xs text-white" onClick={() => onApplyCoupon?.(coupon)} type="button">Apply</button></div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm text-white" onClick={onCheckout} type="button">{checkoutLabel} <span aria-hidden="true">→</span></button>
    </aside>
  );
}
