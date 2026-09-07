import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";

export default function ProductCard({ product }) {
  const item = Array.isArray(product)
    ? { name: product[0], sellingPrice: product[1], rating: product[2], images: product[3] }
    : product;
  const image = item.images?.[0];
  const price = Number(item.sellingPrice || 0);

  return (
    <article className="min-w-0">
      <Link className="block overflow-hidden rounded-2xl bg-[#f0eeed]" to={item._id ? `/products/${item._id}` : "/products"}>
        {image ? <img alt={item.name} className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105" src={image} /> : <div className="aspect-square w-full bg-[#f0eeed]" />}
      </Link>
      <h3 className="mt-2 truncate font-sans text-sm font-bold sm:text-base">{item.name}</h3>
      <p className="mt-1"><RatingStars rating={Number(item.rating || 0)} /></p>
      <p className="mt-1 font-sans text-base font-bold sm:text-lg">${price}</p>
    </article>
  );
}
