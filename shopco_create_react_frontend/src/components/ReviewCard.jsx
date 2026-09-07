import RatingStars from "./RatingStars";

export default function ReviewCard({ name, stars, rating, quote, date }) {
  return (
    <article className="rounded-2xl border border-black/10 p-6">
      {rating ? <RatingStars rating={rating} showScore={false} /> : <p className="text-amber-400">{stars || "★★★★★"}</p>}
      <h3 className="mt-3 font-sans font-bold">{name} <span className="text-green-600">●</span></h3>
      <p className="mt-3 font-sans text-sm leading-6 text-black/60">“{quote}”</p>
      {date && <span className="mt-2 font-sans text-xs text-black/50">Posted on {date}</span>}
    </article>
  );
}
