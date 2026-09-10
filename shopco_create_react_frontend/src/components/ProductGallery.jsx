import { useState } from "react";

import getImageUrl from "../utls/imgageUrl";

export default function ProductGallery({ images = [], name }) {
  const [activeImage, setActiveImage] = useState(0);


  const gallery = images;
  if (!gallery.length) return <div className="aspect-square rounded-2xl bg-[#f0eeed]" />;
  return (
    <div className="grid grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)] grid-rows-3 gap-2">
      {gallery.slice(0, 3).map((image, index) => <button aria-label={`View image ${index + 1}`} className={`aspect-square overflow-hidden rounded-xl bg-[#f0eeed] transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 shadow-sm hover:shadow-md ${activeImage === index ? "ring-2 ring-black" : ""}`} key={`${image}+index`} onClick={() => setActiveImage(index)} type="button"><img alt={`${name} thumbnail ${index + 1}`} className="block h-full w-full object-cover" src={getImageUrl(image)} /></button>)}
      <div className="col-start-2 row-span-3 row-start-1 aspect-square overflow-hidden rounded-2xl bg-[#f0eeed]"><img alt={name} className="block h-full w-full object-cover" src={getImageUrl(gallery[activeImage])} /></div>
    </div>
  );
}


