import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandStrip from "../components/BrandStrip";
import ProductSection from "../components/ProductSection";
import ReviewCard from "../components/ReviewCard";
import Hero from "../components/Hero";

const API_BASE_URL =
    import.meta.env.VITE_BACKEND_API_BASE_URL ||
    "http://localhost:5000/api/";

const styleImages = ["src/assets/casual.png","src/assets/formal.png","src/assets/party.png","src/assets/gym.png"];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}products?limit=20&sort=newest`)
            .then((response) =>
                response.ok
                    ? response.json()
                    : Promise.reject(
                        new Error("Unable to load products")
                    )
            )
            .then((data) => setProducts(data.products || []))
            .catch((requestError) => setError(requestError.message));

            
    }, []);

    const styles = ["Casual", "Formal", "Party", "Gym"].map(
        (name, index) => ({
            name,
            product: products[index],
        })
    );

    return (
        <main className="overflow-hidden mb-25 bg-white text-black">
            <Hero products={products} />

            <BrandStrip />

            {error && (
                <p className="mx-auto max-w-310 px-4 py-4 font-sans text-sm text-red-600">
                    {error}
                </p>
            )}

            {products.length > 0 && (
                <ProductSection
                    title="New Arrivals"
                    products={products.slice(0, 4)}
                />
            )}

            <div className="mx-auto max-w-310 border-t border-black/10" />

            {products.length > 4 && (
                <ProductSection
                    title="Top Selling"
                    products={products.slice(4, 8)}
                />
            )}

            <section className="mx-4 rounded-3xl bg-[#f0f0f0] px-4 py-10 sm:mx-6 sm:px-8 lg:mx-auto lg:max-w-310 lg:px-16 lg:py-16">
                <h2 className="text-center font-integral text-3xl uppercase sm:text-4xl lg:text-5xl">
                    Browse by dress style
                </h2>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
                    {styles.map(({ name, product }, index) => (
                        <Link
                            className={`group relative h-48 overflow-hidden rounded-2xl bg-white sm:h-64 ${index % 3 === 0
                                ? "lg:col-span-4"
                                : "lg:col-span-8"
                                }`}
                            key={name}
                            to={`/products?search=${name}`}
                        >
                            
                                <img
                                    alt={name}
                                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={styleImages[index]}
                                />
                            

                            <span className="absolute left-6 top-5 font-sans text-2xl font-bold sm:text-3xl">
                                {name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-310 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="font-integral text-3xl uppercase sm:text-4xl lg:text-5xl">
                        Our happy customers
                    </h2>

                    <div className="hidden gap-3 sm:flex">
                        <button
                            aria-label="Previous testimonials"
                            className="text-xl"
                            type="button"
                        >
                            ←
                        </button>

                        <button
                            aria-label="Next testimonials"
                            className="text-xl"
                            type="button"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <ReviewCard
                        name="Sarah M."
                        quote="The clothes are exactly as pictured and the quality is outstanding."
                    />

                    <ReviewCard
                        name="Alex K."
                        quote="Finding clothes that match my style has never been easier."
                    />

                    <ReviewCard
                        name="James L."
                        stars="★★★★☆"
                        quote="Fast shipping, great fit, and a smooth shopping experience."
                    />
                </div>
            </section>

        </main>
    );
}
