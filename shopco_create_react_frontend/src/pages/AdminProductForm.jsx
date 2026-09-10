import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL ||
  "http://localhost:5000/api/";

const initial = {
  name: "",
  description: "",
  category: "",
  markedPrice: "",
  sellingPrice: "",
  discountPercentage: "",
  stockQuantity: "",
  images: "",
  sizeOptions: "S,M,L,XL,XXL",
  colorOptions: "",
};

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function AdminProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState(SIZE_OPTIONS);

  const [selectedColors, setSelectedColors] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}admin/categories`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []));

    if (productId) {
      fetch(`${API_BASE_URL}products/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          const product = data.product;

          setForm({
            ...product,
            images: product.images?.join(",") || "",
            sizeOptions: product.sizeOptions?.join(",") || "",
            colorOptions: product.colorOptions?.join(",") || "",
          });
          setSelectedSizes(
            (product.sizeOptions || []).filter((size) =>
              SIZE_OPTIONS.includes(size)
            )
          );
          setSelectedColors(product.colorOptions || []);
        });
    }
  }, [productId]);

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("markedPrice", form.markedPrice);
    formData.append("sellingPrice", form.sellingPrice);
    formData.append("discountPercentage", form.discountPercentage || "0");
    formData.append("stockQuantity", form.stockQuantity || "0");

    selectedSizes.forEach((size) => {
      formData.append("sizeOptions", size);
    });

    selectedColors.forEach((color) => {
      formData.append("colorOptions", color);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}admin/products${productId ? `/${productId}` : ""}`,
        {
          method: productId ? "PATCH" : "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message || "Something went wrong.");
      setIsError(!response.ok);

      if (response.ok) {
        navigate("/admin");
      }
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
      setIsError(true);
    }
  };

  const fields = [
    ["name", "Product name"],
    ["description", "Description"],
    ["markedPrice", "Marked price"],
    ["sellingPrice", "Selling price"],
    ["discountPercentage", "Discount percentage"],
    ["stockQuantity", "Stock quantity"],
    ["images", "Images"],
    ["sizeOptions", "Sizes"],
    ["colorOptions", "Colors (comma separated)"],
  ];

  return (
    <main className="mx-auto max-w-190 px-4 mb-25 py-8 bg-25 font-sans sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-integral text-3xl uppercase">
          {productId ? "Edit Product" : "Create Product"}
        </h1>

        <Link className="text-sm underline" to="/admin">
          Back to admin
        </Link>
      </div>

      <form
        className="mt-8 rounded-2xl border border-black/10 p-6"
        onSubmit={submit}
      >
        {fields.map(([key, label]) => (
          <label
            className="mt-4 block text-sm font-bold first:mt-0"
            key={key}
          >
            {label}

            {key === "description" ? (
              <textarea
                className="mt-2 min-h-28 w-full rounded-xl bg-[#f0f0f0] p-4 font-normal outline-none"
                onChange={(event) =>
                  setForm({
                    ...form,
                    [key]: event.target.value,
                  })
                }
                value={form[key] || ""}
              />
            ) : key === "images" ? (
              <div className="mt-2 space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/20 bg-[#f0f0f0] p-6 font-normal">
                  <span className="text-xl">+</span>
                  <span>Choose product images</span>

                  <input
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files || []);

                      setImages((current) => [...current, ...files]);
                      setSelectedFiles((current) => [...current, ...files]);
                      event.target.value = "";
                    }}
                    type="file"
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        className="flex items-center justify-between rounded-xl bg-[#f0f0f0] px-4 py-3 font-normal"
                        key={`${file.name}-${file.lastModified}-${index}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-lg">🖼</span>
                          <span className="truncate text-sm">{file.name}</span>
                        </div>

                        <button
                          aria-label={`Remove ${file.name}`}
                          className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-lg leading-none text-white"
                          onClick={() => {
                            setImages((current) =>
                              current.filter((_, fileIndex) => fileIndex !== index)
                            );
                            setSelectedFiles((current) =>
                              current.filter((_, fileIndex) => fileIndex !== index)
                            );
                          }}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : key === "sizeOptions" ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const isSelected = selectedSizes.includes(size);

                  return (
                    <button
                      className={`rounded-full border px-5 py-3 ${
                        isSelected
                          ? " bg-black text-white"
                          : " bg-[#f0f0f0] text-black"
                      }`}
                      key={size}
                      onClick={() =>
                        setSelectedSizes((current) =>
                          current.includes(size)
                            ? current.filter((value) => value !== size)
                            : [...current, size]
                        )
                      }
                      type="button"
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                className="mt-2 w-full rounded-full bg-[#f0f0f0] px-4 py-3 font-normal outline-none"
                onChange={(event) =>
                  setForm({
                    ...form,
                    [key]: event.target.value,
                  })
                }
                value={form[key] || ""}
              />
            )}
          </label>
        ))}

        <label className="mt-4 block text-sm font-bold">
          Category

          <select
            className="mt-2 w-full rounded-full bg-[#f0f0f0] px-4 py-3 font-normal outline-none"
            onChange={(event) =>
              setForm({
                ...form,
                category: event.target.value,
              })
            }
            value={form.category || ""}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button
          className="mt-6 w-full rounded-full bg-black py-4 text-sm text-white"
          type="submit"
        >
          {productId ? "Save Product" : "Create Product"}
        </button>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              isError
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}
            role={isError ? "alert" : "status"}
          >
            {message}
          </div>
        )}
      </form>

      
    </main>
  );
}

