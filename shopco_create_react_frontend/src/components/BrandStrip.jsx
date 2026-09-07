const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

export default function BrandStrip() {
  return (
    <section className="bg-black px-4 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-310 flex-wrap items-center justify-around gap-x-8 gap-y-5 sm:gap-x-12">
        {brands.map((brand) => <span className="font-serif text-lg sm:text-2xl" key={brand}>{brand}</span>)}
      </div>
    </section>
  );
}
