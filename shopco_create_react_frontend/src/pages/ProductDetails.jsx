import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewsletterSignup from "../components/NewsletterSignup";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import RatingStars from "../components/RatingStars";
import ReviewCard from "../components/ReviewCard";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";
const reviews = [{ name: "Samantha D.", rating: 5, quote: "I absolutely love this product! The design is unique and the fabric feels so comfortable.", date: "August 14, 2023" }, { name: "Alex M.", rating: 4.5, quote: "The product exceeded my expectations. The quality is excellent.", date: "August 15, 2023" }, { name: "Ethan R.", rating: 4, quote: "The material is comfortable and the fit is perfect.", date: "August 16, 2023" }, { name: "Olivia P.", rating: 4.5, quote: "I value simplicity and functionality. This product gets it right.", date: "August 17, 2023" }];

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}products/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data.product);
        setSelectedSize(data.product.sizeOptions?.[0] || "");
        setSelectedColor(data.product.colorOptions?.[0] || "");
        const relatedResponse = await fetch(`${API_BASE_URL}products?limit=4&category=${data.product.category?._id || data.product.category}`);
        if (relatedResponse.ok) setRelatedProducts((await relatedResponse.json()).products || []);
      } catch (error) { setMessage(error.message); } finally { setLoading(false); }
    }
    loadProduct();
  }, [productId]);

  async function addToCart() {
    try {
      const response = await fetch(`${API_BASE_URL}cart/items`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ productId: product._id, quantity, size: selectedSize, color: selectedColor }) });
      if (!response.ok) throw new Error("Please log in to add items");
      setMessage("Added to cart");
    } catch (error) { setMessage(error.message); }
  }

  if (loading) return <main className="p-10 text-center font-sans">Loading product...</main>;
  if (!product) return <main className="p-10 text-center font-sans">{message || "Product not found"}</main>;
  return <main className="bg-white px-4 pb-16 text-black sm:px-6 lg:px-8"><div className="mx-auto max-w-310"><nav className="flex gap-2 py-5 font-sans text-xs text-black/50"><Link to="/">Home</Link><span>›</span><Link to="/products">Shop</Link><span>›</span><span>{product.name}</span></nav><section className="grid gap-8 lg:grid-cols-2 lg:gap-12"><ProductGallery images={product.images} name={product.name} /><div className="font-sans"><h1 className="font-integral text-3xl uppercase leading-tight sm:text-4xl">{product.name}</h1><div className="mt-3"><RatingStars rating={product.rating} /></div><div className="mt-3 flex flex-wrap items-center gap-3"><strong className="text-2xl">${product.sellingPrice}</strong>{product.markedPrice > product.sellingPrice && <><span className="text-2xl text-black/30 line-through">${product.markedPrice}</span><span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-500">-{product.discountPercentage}%</span></>}</div><p className="mt-4 border-b border-black/10 pb-5 text-sm leading-6 text-black/60">{product.description}</p><div className="border-b border-black/10 py-5"><p className="mb-3 text-sm text-black/60">Select Colors</p><div className="flex flex-wrap gap-3">{(product.colorOptions || []).map((color) => <button aria-label={`Select ${color}`} className={`rounded-full border px-3 py-2 text-xs ${selectedColor === color ? "border-black bg-black text-white" : "border-black/10 bg-[#f0f0f0]"}`} key={color} onClick={() => setSelectedColor(color)} type="button">{color}</button>)}</div></div><div className="border-b border-black/10 py-5"><p className="mb-3 text-sm text-black/60">Choose Size</p><div className="flex flex-wrap gap-2">{(product.sizeOptions || []).map((size) => <button className={`rounded-full px-5 py-2.5 text-sm ${selectedSize === size ? "bg-black text-white" : "bg-[#f0f0f0] text-black/60"}`} key={size} onClick={() => setSelectedSize(size)} type="button">{size}</button>)}</div></div><div className="mt-5 flex gap-3"><QuantitySelector max={product.stockQuantity} onChange={setQuantity} value={quantity} /><button className="flex-1 rounded-full bg-black px-6 py-3 text-sm text-white disabled:opacity-50" disabled={!product.stockQuantity} onClick={addToCart} type="button">{product.stockQuantity ? "Add to Cart" : "Out of Stock"}</button></div>{message && <p className="mt-3 text-sm text-black/60">{message}</p>}</div></section><section className="mt-16"><div className="grid grid-cols-3 border-b border-black/10 font-sans text-sm"><button className="border-b-2 border-black py-4" type="button">Product Details</button><button className="border-b-2 border-black py-4 font-bold" type="button">Rating & Reviews</button><button className="py-4 text-black/50" type="button">FAQs</button></div><div className="mt-8 flex items-center justify-between"><h2 className="font-sans text-xl font-bold">All Reviews <span className="text-sm font-normal text-black/50">(451)</span></h2><button className="rounded-full bg-black px-5 py-3 text-xs text-white" type="button">Write a Review</button></div><div className="mt-6 grid gap-4 md:grid-cols-2">{reviews.map((review) => <ReviewCard key={review.name} {...review} />)}</div></section><section className="mt-16"><h2 className="text-center font-integral text-3xl uppercase sm:text-4xl">You might also like</h2><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)}</div></section></div><NewsletterSignup /></main>;
}
