import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiChevronUp } from "react-icons/hi2";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaEnvelope
} from "react-icons/fa";
import {
  iconArr,
  menuArr
} from "~/assets/ContentArrProject/Footer/MenuAndIcon";
import { useLanguage } from "~/contexts/LanguageProvider";
import GeminiCustom from "../GeminiCustom/GeminiCustom";

const Footer = () => {
  const { t } = useLanguage();
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! How can I help you today?",
      time: "10:30"
    },
    {
      id: 2,
      sender: "bot",
      text: "Feel free to ask about our books or any questions!",
      time: "10:31"
    }
  ]);
  const messagesEndRef = useRef(null);

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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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
                <FaEnvelope className="h-5 w-5" />
              </button>
            </form>

            <div className="flex items-center gap-4 mt-6">
              {[
                {
                  label: "Facebook",
                  icon: <FaFacebook className="h-4 w-4" />
                },
                {
                  label: "Instagram",
                  icon: <FaInstagram className="h-4 w-4" />
                },
                {
                  label: "YouTube",
                  icon: <FaYoutube className="h-4 w-4" />
                },
                {
                  label: "TikTok",
                  icon: <FaTiktok className="h-4 w-4" />
                }
              ].map((s, i) => (
                <Link
                  key={i}
                  to=""
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transform transition-transform hover:-translate-y-1"
                >
                  {s.icon}
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
        className={`fixed right-6 bottom-24 w-14 h-14 rounded-full backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/20 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:from-blue-500/30 hover:to-purple-600/30 ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: showTop
            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8))"
            : "",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)"
        }}
      >
        <HiChevronUp className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
      </button>

      {/* Chat Window */}

      <div>
        <GeminiCustom />
      </div>
    </footer>
  );
};

export default Footer;
