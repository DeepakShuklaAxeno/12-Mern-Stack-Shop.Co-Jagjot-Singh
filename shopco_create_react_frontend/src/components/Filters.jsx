const sizes = ["S", "M", "L", "XL"];

const colors = [
    "Black",
    "White",
    "Navy Blue",
    "Olive",
    "Grey",
    "Red",
];

function Chevron({ down = false }) {
    return (
        <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path
                d={
                    down
                        ? "m6 9 6 6 6-6"
                        : "m9 18 6-6-6-6"
                }
            />
        </svg>
    );
}

function FilterGroup({ title, children }) {
    return (
        <section className="border-b border-black/10 py-5 first:pt-0">
            <div className="flex items-center justify-between">
                <h3 className="font-sans text-xl font-bold">
                    {title}
                </h3>

                <Chevron down />
            </div>

            {children}
        </section>
    );
}

export default function Filters({
    onClose,
    update,
    categories = [],
    active = {},
}) {
    return (
        <aside className="h-full overflow-y-auto bg-white px-5 pb-6 pt-5 sm:px-8 lg:h-auto lg:rounded-2xl lg:border lg:border-black/10 lg:p-5">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="font-sans text-xl font-bold">
                    Filters
                </h2>

                <button
                    aria-label="Close filters"
                    className="text-3xl leading-none text-black/50 lg:hidden"
                    onClick={onClose}
                    type="button"
                >
                    ×
                </button>
            </div>

            <FilterGroup title="Categories">
                <div className="mt-2 space-y-4 font-sans text-base text-black/60">
                    {categories.map((category) => (
                        <button
                            className="flex w-full justify-between"
                            key={category._id}
                            onClick={() =>
                                update("category", category._id)
                            }
                            type="button"
                        >
                            {category.name}

                            <Chevron />
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Price">
                <div className="grid grid-cols-2 gap-2">
                    <input
                        aria-label="Minimum price"
                        className="w-full rounded-full bg-[#f0f0f0] px-3 py-2 text-sm outline-none"
                        min="0"
                        onChange={(event) =>
                            update("minPrice", event.target.value)
                        }
                        placeholder="Min"
                        type="number"
                        value={active.minPrice || ""}
                    />

                    <input
                        aria-label="Maximum price"
                        className="w-full rounded-full bg-[#f0f0f0] px-3 py-2 text-sm outline-none"
                        min="0"
                        onChange={(event) =>
                            update("maxPrice", event.target.value)
                        }
                        placeholder="Max"
                        type="number"
                        value={active.maxPrice || ""}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Colors">
                <div className="mt-4 flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            className={`rounded-full border px-3 py-2 font-sans text-xs ${
                                active.color === color
                                    ? "border-black bg-black text-white"
                                    : "border-black/10 bg-[#f0f0f0]"
                            }`}
                            key={color}
                            onClick={() =>
                                update(
                                    "color",
                                    active.color === color ? "" : color
                                )
                            }
                            type="button"
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Size">
                <div className="mt-4 flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            className={`rounded-full px-5 py-2.5 font-sans text-sm ${
                                active.size === size
                                    ? "bg-black text-white"
                                    : "bg-[#f0f0f0] text-black/60"
                            }`}
                            key={size}
                            onClick={() =>
                                update(
                                    "size",
                                    active.size === size ? "" : size
                                )
                            }
                            type="button"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Availability">
                <div className="mt-3 space-y-3 font-sans text-sm text-black/60">
                    <label className="flex gap-2">
                        <input
                            checked={active.availability === "in-stock"}
                            onChange={() =>
                                update(
                                    "availability",
                                    active.availability === "in-stock"
                                        ? ""
                                        : "in-stock"
                                )
                            }
                            type="checkbox"
                        />

                        In stock
                    </label>

                    <label className="flex gap-2">
                        <input
                            checked={
                                active.availability === "out-of-stock"
                            }
                            onChange={() =>
                                update(
                                    "availability",
                                    active.availability === "out-of-stock"
                                        ? ""
                                        : "out-of-stock"
                                )
                            }
                            type="checkbox"
                        />

                        Out of stock
                    </label>
                </div>
            </FilterGroup>

            <button
                className="mt-5 w-full rounded-full bg-black py-3.5 font-sans text-sm text-white"
                onClick={onClose}
                type="button"
            >
                Apply Filter
            </button>
        </aside>
    );
}