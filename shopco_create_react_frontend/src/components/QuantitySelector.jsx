export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex h-11 items-center justify-between gap-5 rounded-full bg-[#f0f0f0] px-4  font-sans text-sm">
      <button aria-label="Decrease quantity" className="text-lg leading-none hover:bg-gray-500" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} type="button">−</button>
      <span aria-live="polite" className="min-w-4 text-center">{value}</span>
      <button aria-label="Increase quantity" className="text-lg leading-none hover:bg-gray-500" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} type="button">+</button>
    </div>
  );
}
