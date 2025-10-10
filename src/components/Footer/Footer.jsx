import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  iconArr,
  menuArr
} from "~/assets/ContentArrProject/Footer/MenuAndIcon";
import { useLanguage } from "~/contexts/LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // reveal on scroll
  const rootRef = useRef(null);
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const items = container.querySelectorAll("[data-rev]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rev-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    items.forEach((el, i) => {
      el.style.setProperty("--rev-delay", `${i * 80}ms`);
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple client-side validation
    const ok = /^\S+@\S+\.\S+$/.test(email);
    if (!ok) {
      // keep it lightweight: use alert/console (project has Toastify elsewhere, but avoid coupling)
      console.log("Invalid email for newsletter:", email);
      return;
    }
    console.log("Subscribe email:", email);
    setEmail("");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#f5f5f5] text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-14" ref={rootRef}>
        <style>{`
          [data-rev]{opacity:0;transform:translateY(12px);transition:opacity 420ms var(--rev-delay) ease, transform 420ms var(--rev-delay) ease}
          .rev-visible{opacity:1;transform:none}
          .footer-link{position:relative}
          .footer-link::after{content:'';position:absolute;left:0;bottom:-6px;height:2px;width:0;background:rgba(0,0,0,0.08);transition:width 220ms ease}
          .footer-link:hover::after{width:36px}
        `}</style>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left column: logo + contact */}
          <div className="md:col-span-4" data-rev>
            <h3 className="text-3xl font-serif tracking-wide">
              {t("footer.logo")}
            </h3>
            <p className="mt-4 text-sm text-gray-500">{t("footer.callUs")}</p>
            <p className="text-3xl font-medium mt-2">{t("footer.phone")}</p>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>{t("footer.address")}</p>
              <p>{t("footer.email")}</p>
              <p>{t("footer.fax")}</p>
            </div>
          </div>
          {/* Middle columns: info / services / account */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            <div data-rev>
              <h4 className="uppercase text-sm mb-4">
                {t("footer.info.title")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {t("footer.info.items").map((item, i) => (
                  <li key={i} className="py-1">
                    <Link
                      to=""
                      className="footer-link text-gray-600 hover:text-gray-800"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div data-rev>
              <h4 className="uppercase text-sm mb-4">
                {t("footer.services.title")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {t("footer.services.items").map((item, i) => (
                  <li key={i}>
                    <Link
                      to=""
                      className="footer-link text-gray-600 hover:text-gray-800"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div data-rev>
              <h4 className="uppercase text-sm mb-4">
                {t("footer.account.title")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {t("footer.account.items").map((item, i) => (
                  <li key={i}>
                    <Link
                      to=""
                      className="footer-link text-gray-600 hover:text-gray-800"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-3" data-rev>
            <h4 className="uppercase text-sm mb-4">
              {t("footer.newsletter.title")}
            </h4>
            <p className="text-sm text-gray-500">
              {t("footer.newsletter.subtitle")}
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex items-center">
              <input
                type="text"
                placeholder={t("footer.newsletter.placeholder")}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-l-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                aria-label={t("footer.newsletter.subscribe")}
                className="bg-black text-white px-4 py-3 rounded-r-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-4 mt-6">
              {[
                {
                  label: "Facebook",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.08 5.66 21.27 10.44 22v-7.01H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85h2.74l-.44 2.92h-2.3V22C18.34 21.27 22 17.08 22 12.07z" />
                    </svg>
                  )
                },
                {
                  label: "Instagram",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M17.5 6.5h.01" />
                    </svg>
                  )
                },
                {
                  label: "YouTube",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23 7.2a3 3 0 00-2.1-2.12C19.2 4.5 12 4.5 12 4.5s-7.2 0-8.9.58A3 3 0 001.1 7.2 31.2 31.2 0 000 12a31.2 31.2 0 001.1 4.8 3 3 0 002 2.12C4.8 19.5 12 19.5 12 19.5s7.2 0 8.9-.58a3 3 0 002.1-2.12A31.2 31.2 0 0024 12a31.2 31.2 0 00-1-4.8zM10 15V9l5 3-5 3z" />
                    </svg>
                  )
                },
                {
                  label: "TikTok",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 3v10.5A4.5 4.5 0 1014.5 9H12a3 3 0 01-3-3V3H9z" />
                      <path
                        d="M16 3.5a3.5 3.5 0 01-1.5-.3v6.3a5.5 5.5 0 11-1.5-3.9V3.5a7 7 0 003 0z"
                        fill="currentColor"
                        opacity="0.9"
                      />
                    </svg>
                  )
                }
              ].map((s, i) => (
                <Link
                  key={i}
                  to=""
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transform transition-transform hover:-translate-y-1"
                >
                  {s.svg}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div>{t("footer.copyright")}</div>
          <div className="flex items-center gap-4 text-2xl text-gray-400 mt-4 md:mt-0">
            {iconArr.map((icon, idx) => (
              <span key={idx} className="text-gray-400">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label={t("footer.backToTop")}
        className={`fixed right-6 bottom-6 w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center transition-opacity ${
          showTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
