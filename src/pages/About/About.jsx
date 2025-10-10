import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import img1 from "~/assets/images/SaleHomepagePic1.jpeg";
import img2 from "~/assets/images/SaleHomepagePic2.jpeg";
import Footer from "~/components/Footer/Footer";

// Component fade-in khi scroll
const FadeSection = ({ children, className = "" }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-gray-50">
      {/* Header */}
      <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-md py-6 sticky top-0 z-20 transition-colors duration-500 flex">
        <div
          onClick={() => {
            navigate("/shop");
          }}
          className="cursor-pointer flex space-x-3 items-center px-5 py-3"
        >
          <FaArrowLeftLong />
          <p>Back to shop</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col max-w-6xl mx-auto px-4 py-16 space-y-20">
        <h2 className="text-3xl font-bold">About</h2>
        {/* Section 1 */}
        <FadeSection className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold mb-2">Website E-Commerce</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              This project uses React, Tailwind CSS, Node.js, Express, and
              MongoDB to build a modern and convenient shoe e-commerce website.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={img1}
              alt="Giày công nghệ"
              className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </FadeSection>

        {/* Section 2 */}
        <FadeSection className="flex flex-col  items-center gap-10 md:flex-row-reverse">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold mb-2">Technology & Features</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              The website uses React and Tailwind CSS for a modern interface,
              Node.js + Express for the backend, and MongoDB for data storage.
              Users can register, log in, browse the product list, add items to
              favorites and the cart, and make payments via Sepay using QR code
              scanning.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={img2}
              alt="Công nghệ giày"
              className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </FadeSection>

        {/* Section 3 */}
        <FadeSection className="text-center">
          <h2 className="text-2xl font-bold mb-4">Amazing Experience</h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-lg">
            With a user-friendly interface, users can easily search for and
            select their favorite products, manage their shopping cart, and make
            quick payments, aiming for a seamless and convenient online shopping
            experience.
          </p>
        </FadeSection>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
