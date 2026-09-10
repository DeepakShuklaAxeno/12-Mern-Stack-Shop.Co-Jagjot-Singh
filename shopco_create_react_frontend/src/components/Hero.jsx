import { Link } from "react-router-dom"

function Hero() {
    return (
    <section className="w-full flex flex-col md:grid md:grid-cols-2 items-stretch pt-12 px-4 md:px-12 lg:px-20 overflow-hidden bg-[#f2f0f1]">
      <div className="m-0 flex h-full flex-col p-0 items-center gap-6 md:justify-center">
          <div className="min-w-0 w-full md:flex md:h-full md:flex-col md:justify-center">
                    <h1 className="font-integral text-left mb-[clamp(1rem,2vw,1.5rem)] text-3xl uppercase leading-[0.98] sm:text-5xl lg:text-[clamp(2.5rem,4.2vw,4.5rem)]">
                        Find clothes that matches your style
                    </h1>

                    <p className="font-sans w-full text-[clamp(0.875rem,1.2vw,1.125rem)] text-black/60">
                        Browse through our diverse range of meticulously crafted garments,
                        designed to bring out your individuality and cater to your sense of style.
                    </p>

                    <Link
                        className="mt-[clamp(1.25rem,2.5vw,2rem)] w-full inline-flex min-w-52 justify-center rounded-full bg-black px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)] font-sans md:max-w-auto text-[clamp(0.875rem,1vw,1rem)] text-white transition-transform hover:scale-105"
                        to="/products"
                    >
                        Shop Now
                    </Link>

                    <div className="mt-[clamp(1.5rem,4vw,2.5rem)] grid pb-4 grid-cols-2 md:grid-cols-3">
                        {[
                            ["200+", "International Brands"],
                            ["2,000+", "High-Quality Products"],
                            ["30,000+", "Happy Customers"],
                        ].map(([value, label]) => (
                            <div className="border-black/10 mt-[clamp(0.5rem,1.5vw,1rem)] first:border-r md:border-r md:last:border-0 last:col-span-2 md:last:col-span-1" key={label}>
                              <strong className="font-sans flex justify-center text-[clamp(1.25rem,2.5vw,1.875rem)] font-bold">{value}</strong>
                              <p className="mt-1 font-sans text-[clamp(0.625rem,0.8vw,0.75rem)] text-center w-full leading-4 text-black/60">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

              

              <div className="m-0 w-full relative p-0 md:col-start-2 md:row-start-1" aria-hidden="true">
                <img src="src/assets/hero-image-background.png" className=" px-4 relative z-0 block w-full h-full object-cover" alt="" />
              <svg
                className="absolute left-[6.92%] top-[30.58%]"
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28 0C28.9506 15.0527 40.9472 27.0495 56 28C40.9472 28.9506 28.9506 40.9472 28 56C27.0495 40.9472 15.0527 28.9506 0 28C15.0527 27.0495 27.0495 15.0527 28 0Z"
                  fill="black"
                />
              </svg>

              <svg
                className="absolute left-[75.12%] top-[10.256%]"
                width="76"
                height="76"
                viewBox="0 0 76 76"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M38 0C39.2901 20.4286 55.5712 36.71 76 38C55.5712 39.2901 39.2901 55.5712 38 76C36.71 55.5712 20.4286 39.2901 0 38C20.4286 36.71 36.71 20.4286 38 0Z"
                  fill="black"
                />
              </svg>
            </div>
        </section>
    )
}

export default Hero