import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "~/contexts/LanguageProvider";

const LanguageSelect = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "EN" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" }
  ];

  const currentLang =
    languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="relative"
      ref={dropdownRef}
    >
      {/* Trigger Button (Inline style for header) */}
      <button className="relative flex items-center justify-center w-3 h-3 lg:w-5 lg:h-5 text-white rounded-full   hover:shadow-lg transition-all duration-300">
        <span className="text-sm">{currentLang.flag}</span>
      </button>

      {/* Dropdown menu — opens below */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-5 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 flex flex-col gap-1 animate-fadeIn z-50"
          style={{
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
            minWidth: "140px"
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                language === lang.code
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;
