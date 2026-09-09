import NewsletterSignup from "./NewsletterSignup"

const footerGroups = [
  { title: "Company", links: ["About", "Features", "Works", "Career"] },
  {
    title: "Help",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  { title: "FAQ", links: ["Account", "Manage Deliveries", "Orders", "Payments"] },
  {
    title: "Resources",
    links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
  },
]

const socialLinks = [
  {
    label: "Twitter",
    href: "https://www.twitter.com",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="14" fill="white" />
        <circle cx="14" cy="14" r="13.5" stroke="black" strokeOpacity="0.2" />
        <path d="M20.174 11.048c-.419.186-.861.302-1.327.372.466-.279.838-.722 1.001-1.257-.442.256-.931.442-1.467.559a2.28 2.28 0 0 0-3.887 2.002c-1.886-.093-3.585-1.001-4.726-2.398a2.28 2.28 0 0 0 .722 3.05 2.27 2.27 0 0 1-1.048-.28v.024a2.28 2.28 0 0 0 1.839 2.258 2.3 2.3 0 0 1-1.048.047 2.28 2.28 0 0 0 2.141 1.583 4.57 4.57 0 0 1-2.84 1.001c-.186 0-.372 0-.535-.023a6.45 6.45 0 0 0 3.515 1.024c4.213 0 6.518-3.492 6.518-6.518v-.303a4.63 4.63 0 0 0 1.467-1.141Z" fill="black" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="14" fill="black" />
        <path d="M11.869 20.175v-5.554H10V12.457h1.869v-1.596c0-1.852 1.131-2.861 2.784-2.861.791 0 1.472.059 1.67.085v1.936l-1.146.001c-.899 0-1.073.427-1.073 1.054v1.381h2.143l-.279 2.164h-1.864v5.554h-2.235Z" fill="white" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="14" fill="white" />
        <circle cx="14" cy="14" r="13.5" stroke="black" strokeOpacity="0.2" />
        <rect x="7.5" y="7.5" width="13" height="13" rx="3.5" stroke="black" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="3.5" stroke="black" strokeWidth="1.2" />
        <circle cx="18.3" cy="9.8" r="0.8" fill="black" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://www.github.com",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="14" fill="white" />
        <circle cx="14" cy="14" r="13.5" stroke="black" strokeOpacity="0.2" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.607 7.227a6.48 6.48 0 0 0-2.052 12.636c.324.054.432-.135.432-.324v-1.107c-1.809.405-2.187-.864-2.187-.864-.297-.756-.729-.945-.729-.945-.594-.405.054-.405.054-.405.648.054.999.675.999.675.567.999 1.512.702 1.89.54.054-.432.216-.702.405-.864-1.431-.162-2.943-.729-2.943-3.213 0-.702.243-1.296.675-1.728-.054-.162-.297-.81.054-1.728 0 0 .54-.162 1.782.675a6.3 6.3 0 0 1 3.24 0c1.242-.837 1.782-.675 1.782-.675.351.891.135 1.539.054 1.728.405.459.675 1.026.675 1.728 0 2.484-1.512 3.024-2.97 3.186.243.189.432.594.432 1.188v1.782c0 .162.108.378.459.324a6.48 6.48 0 0 0-2.052-12.636Z" fill="black" />
      </svg>
    ),
  },
]

const paymentMethods = [
  <svg aria-hidden="true" height="18" viewBox="0 0 42 18" width="42"><text fill="#1434CB" fontFamily="Arial, sans-serif" fontSize="12" fontStyle="italic" fontWeight="700" x="2" y="13">VISA</text></svg>,
  <svg aria-hidden="true" height="18" viewBox="0 0 28 18" width="28"><circle cx="10" cy="9" fill="#EB001B" r="7" /><circle cx="18" cy="9" fill="#F79E1B" r="7" /><path d="M14 3.5a7 7 0 0 0 0 11 7 7 0 0 0 0-11Z" fill="#FF5F00" /></svg>,
  <svg aria-hidden="true" height="18" viewBox="0 0 50 18" width="50"><text fill="#003087" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" x="2" y="12">Pay</text><text fill="#009CDE" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" x="22" y="12">Pal</text></svg>,
  <svg aria-hidden="true" height="18" viewBox="0 0 48 18" width="48"><path d="M9.5 3.5a5.5 5.5 0 1 0 0 11h5a5.5 5.5 0 1 0 0-11h-5Z" fill="black" /><path d="M12 1.5c-.1 1.5-.9 2.5-2.3 2.6-.2-1.3.5-2.4 2.3-2.6Zm-2.5 3.8c1.1 0 1.7.6 2.6.6.9 0 1.7-.7 2.8-.7 1.8 0 2.8 1.8 2.8 1.9-1.5.8-1.2 2.8.3 3.4-.4 1.1-1.4 2.5-2.5 2.5-.9 0-1.2-.6-2.3-.6-1.1 0-1.5.6-2.3.6-1.2 0-2.1-1.4-2.5-2.5-.7-2 .4-5.2 3.4-5.2Z" fill="white" transform="translate(1 0)" /></svg>,
  <svg aria-hidden="true" height="18" viewBox="0 0 42 18" width="42"><path d="M13 3h4v4h-4z" fill="#4285F4" /><path d="M17 3h4v4h-4z" fill="#34A853" /><path d="M13 7h4v4h-4z" fill="#FBBC05" /><path d="M17 7h4v4h-4z" fill="#EA4335" /><text fill="#202124" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" x="23" y="12">Pay</text></svg>,
]

function Footer() {
  return (
    <footer className="flow-root bg-[#f0f0f0] px-4 pb-6 text-black md:px-8 lg:px-25">
      <div className="w-full ">
        <NewsletterSignup/>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 md:grid-cols-4 lg:grid-cols-5 lg:items-start lg:gap-8 lg:py-12">
          <div className="col-span-2 w-full md:col-span-4 lg:col-span-1">
            <h2 className="font-integral text-3xl leading-none">SHOP.CO</h2>
            <p className="mt-6 max-w-62 font-sans text-sm leading-5 text-black/60">
              We have clothes that suits your style and which you&apos;re proud to wear. From women to men.
            </p>
            <nav aria-label="Social media" className="mt-8 md:grid  md:justify-batween">
              <ul className="flex gap-3">
                {socialLinks.map(({ label, href, icon }) => (
                  <li key={label}>
                    <a aria-label={label} href={href}>
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {footerGroups.map(({ title, links }) => (
            <nav aria-label={title} className={`min-w-0 font-sans ${title === "Resources" ? "lg:justify-self-end" : ""}`} key={title}>
              <h3 className="text-sm font-medium uppercase tracking-[0.22em]">{title}</h3>
              <ul className="mt-6 space-y-3 text-sm text-black/60">
                {links.map((link) => (
                  <li key={link}>
                    <a className="transition-colors hover:text-black" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 pt-4 text-sm text-black/60 sm:flex-row  sm:justify-between">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <div aria-label="Accepted payment methods" className="flex items-center gap-2">
            {paymentMethods.map((method, index) => (
              <span className="flex h-6 min-w-10 items-center justify-center rounded bg-white px-2 shadow-sm" key={index}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
