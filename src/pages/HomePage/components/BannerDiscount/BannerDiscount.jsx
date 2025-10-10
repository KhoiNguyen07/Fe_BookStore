import React, { useEffect, useState } from "react";
import Button from "~/components/Button/Button";
import CountdownTimer from "~/components/CountdownTimer/CountdownTimer";
import { useLanguage } from "~/contexts/LanguageProvider";

const BannerDiscount = () => {
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const openLightbox = (src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc("");
  };

  return (
    <section className="relative w-full overflow-hidden pt-60 pb-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-20">
          {/* Mobile/Tablet: Promo content first */}
          <div className="w-full xl:w-1/2 flex flex-col justify-center px-2 md:px-6 space-y-6 md:space-y-8 order-1 xl:order-2">
            {/* Special offers badge */}
            <div className="inline-flex items-center px-3 md:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full w-fit mx-auto xl:mx-0">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 md:mr-3 animate-pulse"></div>
              <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("bannerDiscount.badge")}
              </span>
            </div>

            {/* Main headline with gradient - Mobile optimized */}
            <div className="space-y-3 md:space-y-4 text-center xl:text-left">
              <h2 className="text-2xl md:text-4xl xl:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  {t("bannerDiscount.headlineMain")}
                </span>
              </h2>
              <h3 className="text-lg md:text-2xl xl:text-3xl font-semibold text-gray-700">
                {t("bannerDiscount.headlineSub")}
              </h3>
            </div>

            {/* Description - Mobile optimized */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl text-center xl:text-left px-2 md:px-0">
              {t("bannerDiscount.description")}
            </p>

            {/* Enhanced countdown section - Mobile optimized */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl mx-2 md:mx-0">
              <CountdownTimer targetDate={new Date("2030-12-31T23:59:59")} />
            </div>

            {/* Enhanced CTA button - Mobile optimized */}
            <div className="pt-2 md:pt-4 flex justify-center xl:justify-start">
              <Button
                content={t("bannerDiscount.ctaExplore")}
                borderRadius="rounded-full"
              />
            </div>
          </div>

          {/* Images section - Better mobile layout */}
          <div className="w-full xl:w-1/2 flex justify-center items-center relative order-2 xl:order-1">
            {/* Desktop images */}
            <div
              className={`hidden xl:block relative w-[720px] h-[500px] ${
                mounted
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              } transition-all duration-1000 ease-out`}
            >
              {/* Book 1 with enhanced effects */}
              <div className="absolute rotate-6 -left-32 top-20 group">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="/product_img/1/3.jpeg"
                  alt="book-1"
                  onClick={() => openLightbox("/product_img/1/3.jpeg")}
                  className="relative w-[280px] shadow-2xl object-cover rounded-xl cursor-pointer transform hover:-translate-y-6 hover:scale-110 hover:rotate-3 transition-all duration-500 ease-out z-10"
                />
              </div>

              {/* Book 2 with glass morphism effect */}
              <div className="absolute left-28 top-32 group">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-pink-500 to-red-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="/product_img/1/2.jpeg"
                  alt="book-2"
                  onClick={() => openLightbox("/product_img/1/2.jpeg")}
                  className="relative w-[320px] -rotate-6 shadow-2xl object-cover rounded-xl cursor-pointer transform hover:-translate-y-8 hover:scale-110 hover:rotate-0 transition-all duration-700 ease-out z-20"
                />
              </div>

              {/* Book 3 with premium styling */}
              <div className="absolute left-40 -top-5 group">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="/product_img/1/1.jpeg"
                  alt="book-3"
                  onClick={() => openLightbox("/product_img/1/1.jpeg")}
                  className="relative w-[300px] shadow-2xl object-cover rounded-xl cursor-pointer transform hover:-translate-y-10 hover:scale-115 hover:-rotate-2 transition-all duration-700 ease-out z-30"
                />
              </div>
            </div>

            {/* Mobile/Tablet: Better image showcase */}
            <div className="flex xl:hidden flex-col items-center space-y-6 w-full max-w-lg">
              {/* Featured main image */}
              <div className="group relative w-full max-w-xs">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="/product_img/1/2.jpeg"
                  alt="featured-book"
                  onClick={() => openLightbox("/product_img/1/2.jpeg")}
                  className="relative w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 z-10"
                />
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-white font-medium text-sm">
                      {t("bannerDiscount.featuredCollection")}
                    </p>
                    <p className="text-white/80 text-xs">
                      {t("bannerDiscount.tapToView")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary images row */}
              <div className="flex justify-center items-center gap-4 w-full px-4">
                {[
                  { src: "/product_img/1/3.jpeg", label: "Adventure" },
                  { src: "/product_img/1/1.jpeg", label: "Romance" }
                ].map((book, index) => (
                  <div
                    key={index}
                    className="group relative flex-1 max-w-[120px]"
                  >
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <img
                      src={book.src}
                      alt={`book-${index + 1}`}
                      onClick={() => openLightbox(book.src)}
                      className="relative w-full h-32 md:h-40 object-cover rounded-xl shadow-lg cursor-pointer transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 z-10"
                    />
                    <p className="text-center text-xs md:text-sm font-medium text-gray-600 mt-2">
                      {t(
                        `bannerDiscount.bookLabels.${book.label.toLowerCase()}`
                      ) || book.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating poster */}
      <div className="hidden xl:block absolute right-12 bottom-8 group">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative w-64 h-72 overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 hover:-rotate-2 transition-all duration-500">
          <img
            src="/product_img/3/1.jpeg"
            alt="featured-book"
            onClick={() => openLightbox("/product_img/3/1.jpeg")}
            className="w-full h-full object-cover cursor-pointer"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium">
              {t("bannerDiscount.floating.featuredBook")}
            </p>
            <p className="text-xs opacity-90">
              {t("bannerDiscount.floating.clickToPreview")}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="max-w-5xl max-h-[100vh] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={lightboxSrc}
                alt="preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
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
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerDiscount;
