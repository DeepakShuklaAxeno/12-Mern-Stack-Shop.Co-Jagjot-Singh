function Star({ filled = true, half = false }) {
  const id = half ? "half-star" : undefined;
  return (
    <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 20 20">
      {half && <defs><linearGradient id={id}><stop offset="50%" stopColor="#ffc633" /><stop offset="50%" stopColor="#d6dce5" /></linearGradient></defs>}
      <path d="m10 1.5 2.63 5.33 5.88.86-4.25 4.14 1 5.85L10 14.92l-5.26 2.76 1-5.85L1.5 7.69l5.88-.86L10 1.5Z" fill={half ? `url(#${id})` : filled ? "#ffc633" : "#d6dce5"} stroke={half || filled ? "#ffc633" : "#d6dce5"} strokeLinejoin="round" />
    </svg>
  );
}

export default function RatingStars({ rating = 0, showScore = true }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => <Star filled={index < fullStars} half={index === fullStars && hasHalf} key={index} />)}
      {showScore && <span className="ml-1 font-sans text-sm text-black/60">{rating}/5</span>}
    </span>
  );
}
