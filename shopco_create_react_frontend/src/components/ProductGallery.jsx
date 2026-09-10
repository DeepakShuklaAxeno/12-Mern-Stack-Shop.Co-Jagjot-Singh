import { useState } from "react";

import getImageUrl from "../utls/imgageUrl";

export default function ProductGallery({ images = [], name }) {
  const [activeImage, setActiveImage] = useState(0);

  
  const gallery = images;
  if (!gallery.length) return <div className="aspect-square rounded-2xl bg-[#f0eeed]" />;
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:w-24 sm:flex-col">
        {gallery.slice(0, 3).map((image, index) => <button aria-label={`View image ${index + 1}`} className={`overflow-hidden rounded-xl bg-[#f0eeed] ${activeImage === index ? "ring-2 ring-black" : ""}`} key={image} onClick={() => setActiveImage(index)} type="button"><img alt={`${name} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" src={getImageUrl(image)} /></button>)}
      </div>
      <div className="flex-1 overflow-hidden rounded-2xl bg-[#f0eeed]"><img alt={name} className="aspect-square w-full object-cover" src={gallery[activeImage]} /></div>
    </div>
  );
}


