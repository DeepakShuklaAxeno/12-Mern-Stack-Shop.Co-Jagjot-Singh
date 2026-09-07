import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, products }) {
  return (
    <section className="mx-auto max-w-310 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <h2 className="text-center font-integral text-3xl uppercase sm:text-4xl lg:text-5xl">{title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:mt-12">
        {products.map((product, index) => <ProductCard index={index} key={product._id || product[0] || product.name} product={product} />)}
      </div>
      <div className="mt-8 text-center lg:mt-10">
        <Link className="inline-flex min-w-52 items-center justify-center rounded-full border border-black/10 px-8 py-3 font-sans text-sm transition-colors hover:bg-black hover:text-white" to="/products">View All</Link>
      </div>
    </section>
  );
}
