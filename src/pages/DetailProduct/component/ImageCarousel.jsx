import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildImageUrl } from "~/lib/utils";
const ImageCarousel = ({ images, name = "null" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* Hình ảnh hiện tại */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.a
            key={images[currentIndex]}
            href={buildImageUrl(images[currentIndex])}
            data-fancybox
            data-caption={name}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="block"
          >
            <img
              src={buildImageUrl(images[currentIndex])}
              alt={name}
              className="w-full h-auto object-cover rounded-lg cursor-zoom-in"
            />
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Nút điều hướng trái phải */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dấu chấm chỉ số hình ảnh */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
            animate={{
              scale: i === currentIndex ? 1.3 : 1,
              opacity: i === currentIndex ? 1 : 0.6
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
