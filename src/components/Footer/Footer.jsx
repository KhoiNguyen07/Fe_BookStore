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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage("");

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message! Our team will get back to you soon.",
        "I appreciate you reaching out! How can I assist you today?",
        "Thanks for contacting us! Is there anything specific about our books you'd like to know?",
        "Hello! I'm here to help you with any questions about our bookstore.",
        "Great to hear from you! What kind of books are you looking for?",
        "Thanks for your message! Feel free to ask about our latest arrivals.",
        "I'm happy to help! Do you need recommendations for any particular genre?",
        "Thank you for writing! Our customer service team is always ready to assist.",
        "Hi there! I can help you find the perfect book for your needs.",
        "Thanks for reaching out! Let me know if you need help with your order."
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const botResponse = {
        id: chatMessages.length + 2,
        sender: "bot",
        text: randomResponse,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      };
      setChatMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

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
      {/* Chatbox */}
      <div className="fixed bottom-24 right-6 z-50">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${
            isChatOpen ? "rotate-45" : ""
          }`}
        >
          {isChatOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <h3 className="font-semibold">BookStore Support</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleChatSubmit}
              className="p-4 border-t border-gray-200"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label={t("footer.backToTop")}
        className={`fixed right-6 bottom-6 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-opacity ${
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
