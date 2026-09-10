import { useState } from "react";

export default function OrderSummary({ subtotal = 0, discount = 0, total = subtotal - discount, appliedCoupons = [], onCheckout, onApplyCoupon, checkoutLabel = "Go to Checkout" }) {
  const [coupon, setCoupon] = useState("");
  const couponLabel = appliedCoupons.length
    ? appliedCoupons.map(({ code }) => code).join(", ")
    : "No coupon applied";
  return (
    <aside className="rounded-2xl border border-black/10 p-5 font-sans sm:p-6">
      <h2 className="text-xl font-bold">Order Summary</h2>
      <dl className="mt-5 space-y-4 text-sm text-black/60"><div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold text-black">${subtotal}</dd></div><div className="flex justify-between"><dt>Discount</dt><dd className="font-bold text-red-500">-${discount}</dd></div></dl>
      <div className="my-5 border-t border-black/10 pt-5"><div className="flex justify-between"><span>Total</span><strong className="text-xl">${total}</strong></div></div>
      <div className="flex gap-2"><input className="min-w-0 flex-1 rounded-full bg-[#f0f0f0] px-4 py-3 text-xs outline-none" onChange={(event) => setCoupon(event.target.value)} placeholder="Add promo code" value={coupon} /><button className="rounded-full bg-black px-5 py-3 text-xs text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 shadow-sm hover:shadow-md" onClick={() => onApplyCoupon?.(coupon)} type="button">Apply</button></div>
      <p className={`mt-3 text-xs ${appliedCoupons.length ? "text-green-700" : "text-black/50"}`}>{appliedCoupons.length ? `Coupon applied: ${couponLabel}` : couponLabel}</p>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 shadow-sm hover:shadow-md" onClick={onCheckout} type="button">{checkoutLabel} <span aria-hidden="true">→</span></button>
    </aside>
  );
}
