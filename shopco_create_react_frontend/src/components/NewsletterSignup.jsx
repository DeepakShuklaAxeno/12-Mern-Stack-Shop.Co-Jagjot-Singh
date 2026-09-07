export default function NewsletterSignup() {
  return (
    <section className="mx-4 mb-10 rounded-2xl bg-black px-5 py-7 text-white sm:mx-6 sm:flex sm:items-center sm:justify-between sm:px-8 lg:mx-auto lg:max-w-310 lg:px-16">
      <h2 className="max-w-md font-integral text-2xl uppercase leading-tight sm:text-3xl">Stay up to date about our latest offers</h2>
      <form className="mt-5 flex w-full max-w-sm flex-col gap-3 sm:mt-0" onSubmit={(event) => event.preventDefault()}>
        <input className="rounded-full bg-white px-5 py-3 font-sans text-sm text-black outline-none" placeholder="Enter your email address" type="email" required />
        <button className="rounded-full bg-white px-5 py-3 font-sans text-sm font-bold text-black" type="submit">Subscribe to Newsletter</button>
      </form>
    </section>
  );
}
