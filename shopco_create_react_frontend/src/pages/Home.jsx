import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandStrip from "../components/BrandStrip";
import NewsletterSignup from "../components/NewsletterSignup";
import ProductSection from "../components/ProductSection";
import ReviewCard from "../components/ReviewCard";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}products?limit=20&sort=newest`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load catalog")))
      .then((data) => setProducts(data.products || []))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const styles = ["Casual", "Formal", "Party", "Gym"].map((name, index) => ({ name, product: products[index] }));
  return (
    <main className="overflow-hidden bg-white text-black">
      <section className="relative bg-[#f2f0f1]"><div className="mx-auto grid max-w-310 items-center px-4 pt-10 sm:px-6 lg:min-h-150 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pt-0"><div className="relative z-10 pb-10 lg:py-20"><h1 className="max-w-xl font-integral text-4xl uppercase leading-[0.98] sm:text-5xl lg:text-7xl">Find clothes that matches your style</h1><p className="mt-5 max-w-xl font-sans text-sm leading-6 text-black/60 sm:text-base">Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p><Link className="mt-7 inline-flex min-w-52 justify-center rounded-full bg-black px-8 py-4 font-sans text-sm text-white transition-transform hover:scale-105" to="/products">Shop Now</Link><div className="mt-10 grid max-w-xl grid-cols-3 gap-4">{[["200+", "International Brands"], ["2,000+", "High-Quality Products"], ["30,000+", "Happy Customers"]].map(([value, label]) => <div className="border-r border-black/10 pr-3 last:border-0" key={label}><strong className="font-sans text-xl font-bold sm:text-3xl">{value}</strong><p className="mt-1 font-sans text-[10px] leading-4 text-black/60 sm:text-xs">{label}</p></div>)}</div></div><div className="relative min-h-95 sm:min-h-125 lg:min-h-150">{products[0]?.images?.[0] && <img alt={products[0].name} className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2 object-contain object-bottom lg:w-[115%]" src={products[0].images[0]} />}</div></div></section>
      <BrandStrip />
      {error && <p className="mx-auto max-w-310 px-4 py-4 font-sans text-sm text-red-600">{error}</p>}
      {products.length > 0 && <ProductSection title="New Arrivals" products={products.slice(0, 4)} />}
      <div className="mx-auto max-w-310 border-t border-black/10" />
      {products.length > 4 && <ProductSection title="Top Selling" products={products.slice(4, 8)} />}
      <section className="mx-4 rounded-3xl bg-[#f0f0f0] px-4 py-10 sm:mx-6 sm:px-8 lg:mx-auto lg:max-w-310 lg:px-16 lg:py-16"><h2 className="text-center font-integral text-3xl uppercase sm:text-4xl lg:text-5xl">Browse by dress style</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">{styles.map(({ name, product }, index) => <Link className={`group relative h-48 overflow-hidden rounded-2xl bg-white sm:h-64 ${index % 3 === 0 ? "lg:col-span-4" : "lg:col-span-8"}`} key={name} to={`/products?search=${name}`}>{product?.images?.[0] && <img alt={name} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.images[0]} />}<span className="absolute left-6 top-5 font-sans text-2xl font-bold sm:text-3xl">{name}</span></Link>)}</div></section>
      <section className="mx-auto max-w-310 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="flex items-end justify-between gap-4"><h2 className="font-integral text-3xl uppercase sm:text-4xl lg:text-5xl">Our happy customers</h2><div className="hidden gap-3 sm:flex"><button aria-label="Previous testimonials" className="text-xl" type="button">←</button><button aria-label="Next testimonials" className="text-xl" type="button">→</button></div></div><div className="mt-8 grid gap-4 md:grid-cols-3"><ReviewCard name="Sarah M." quote="The clothes are exactly as pictured and the quality is outstanding." /><ReviewCard name="Alex K." quote="Finding clothes that match my style has never been easier." /><ReviewCard name="James L." stars="★★★★☆" quote="Fast shipping, great fit, and a smooth shopping experience." /></div></section>
      <NewsletterSignup />
    </main>
  );
}
