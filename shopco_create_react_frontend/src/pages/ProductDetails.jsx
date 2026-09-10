import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import RatingStars from "../components/RatingStars";
import ReviewCard from "../components/ReviewCard";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}products/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data.product);
        setSelectedSize(data.product.sizeOptions?.[0] || "");
        setSelectedColor(data.product.colorOptions?.[0] || "");

        const relatedResponse = await fetch(
          `${API_BASE_URL}products?limit=4&category=${data.product.category?._id || data.product.category
          }`
        );
        if (relatedResponse.ok) {
          setRelatedProducts((await relatedResponse.json()).products || []);
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  async function addToCart() {
    try {
      const response = await fetch(`${API_BASE_URL}cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        }),
      });
      if (!response.ok) throw new Error("Please log in to add items");
      window.dispatchEvent(new Event("cart-updated"));
      setMessage("Added to cart");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            rating: reviewRating,
            reviewText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit review");
      }

      setProduct(data.product);
      setReviewText("");
      setReviewRating(5);
      setReviewModalOpen(false);
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="p-10 text-center font-sans">Loading product...</main>
    );
  }

  if (!product) {
    return (
      <main className="p-10 text-center font-sans text-red-400">
        {message || "Product not found"}
      </main>
    );
  }

  return (
    <main className="bg-white px-4 mb-25 pb-16 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-310">
        <nav className="flex gap-2 py-5 font-sans text-xs text-black/50">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Shop</Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <div className="font-sans">
            <h1 className="font-integral text-3xl uppercase leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3">
              <RatingStars rating={product.rating} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <strong className="text-2xl">${product.sellingPrice}</strong>
              {product.markedPrice > product.sellingPrice && (
                <>
                  <span className="text-2xl text-black/30 line-through">
                    ${product.markedPrice}
                  </span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-500">
                    -{product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-4 border-b border-black/10 pb-5 text-sm leading-6 text-black/60">
              {product.description}
            </p>

            <div className="border-b border-black/10 py-5">
              <p className="mb-3 text-sm text-black/60">Select Colors</p>
              <div className="flex flex-wrap gap-3">
                {(product.colorOptions || []).map((color) => (
                  <button
                    aria-label={`Select ${color}`}
                    className={`rounded-full border px-3 py-2 text-xs ${selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-[#f0f0f0]"
                      }`}
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    type="button"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-black/10 py-5">
              <p className="mb-3 text-sm text-black/60">Choose Size</p>
              <div className="flex flex-wrap gap-2">
                {(product.sizeOptions || []).map((size) => (
                  <button
                    className={`rounded-full px-5 py-2.5 text-sm ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#f0f0f0] text-black/60"
                      }`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <QuantitySelector
                max={product.stockQuantity}
                onChange={setQuantity}
                value={quantity}
              />
              <button
                className="flex-1 rounded-full bg-black text-white px-6 py-3 text-sm text-whitetransition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 shadow-sm hover:shadow-md disabled:opacity-50"
                disabled={!product.stockQuantity}
                onClick={addToCart}
                type="button"
              >
                {product.stockQuantity ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
            {message && <p className="mt-3 text-sm text-red/60">{message}</p>}
          </div>
        </section>

        <section className="mt-16">
          <div className="grid grid-cols-3 border-b border-black/10 font-sans text-sm">
            <button className="border-b-2 border-black py-4" type="button">
              Product Details
            </button>
            <button
              className="border-b-2 border-black py-4 font-bold"
              type="button"
            >
              Rating & Reviews
            </button>
            <button className="py-4 text-black/50" type="button">
              FAQs
            </button>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-sans text-xl font-bold">
              All Reviews{" "}
              <span className="text-sm font-normal text-black/50">(451)</span>
            </h2>
            <button
              className="rounded-full bg-black px-5 py-3 text-xs text-white"
              onClick={() => {
                setReviewError("");
                setReviewModalOpen(true);
              }}
              type="button"
            >
              Write a Review
            </button>
            {reviewModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <form
                  className="w-full max-w-md rounded-2xl bg-white p-6"
                  onSubmit={submitReview}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Write a Review</h2>

                    <button
                      aria-label="Close review form"
                      className="text-2xl"
                      onClick={() => setReviewModalOpen(false)}
                      type="button"
                    >
                      &times;
                    </button>
                  </div>

                  <label className="mt-6 block text-sm font-bold">
                    Rating
                    <span className="relative mt-2 block">
                      <select
                        className="w-full appearance-none rounded-full bg-[#f0f0f0] px-4 py-3 pr-10 font-normal"
                        onChange={(event) => setReviewRating(Number(event.target.value))}
                        value={reviewRating}
                      >
                        <option value={5}>5 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={3}>3 stars</option>
                        <option value={2}>2 stars</option>
                        <option value={1}>1 star</option>
                      </select>
                      <ChevronDown />
                    </span>
                  </label>

                  <label className="mt-5 block text-sm font-bold">
                    Review
                    <textarea
                      className="mt-2 min-h-32 w-full rounded-xl bg-[#f0f0f0] p-4 font-normal"
                      maxLength={500}
                      minLength={5}
                      onChange={(event) => setReviewText(event.target.value)}
                      placeholder="Share your experience"
                      
                      value={reviewText}
                    />
                  </label>

                  {reviewError && (
                    <p className="mt-3 text-sm text-red-600">{reviewError}</p>
                  )}

                  <button
                    className="mt-5 w-full rounded-full bg-black py-3 text-sm text-white disabled:opacity-50"
                    disabled={reviewSubmitting}
                    type="submit"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  name={review.userId?.name || "Customer"}
                  rating={review.rating}
                  quote={review.reviewText}
                />
              ))
            ) : (
              <p className="text-sm text-black/50">No reviews yet.</p>
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-center font-integral text-3xl uppercase sm:text-4xl">
            You might also like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      </div>

    </main>
  );
}

