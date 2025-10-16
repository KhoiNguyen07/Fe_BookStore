import React, { useEffect, useState, useMemo } from "react";
import Product from "~/components/Product/Product";
import { productService } from "~/apis/productService";
import bannerImage from "~/assets/images/bannerBestProduct.webp";
import Button from "~/components/Button/Button";
import { useLanguage } from "~/contexts/LanguageProvider";

const BestProducts = () => {
  const { t } = useLanguage();
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchData = () => {
      productService
        .getAllProduct()
        .then((res) => {
          // normalize to array
          const data = res?.data?.data;
          if (Array.isArray(data) && data.length > 0) {
            setListProduct(data);
            clearInterval(intervalId); // có data thì stop
          }
        })
        .catch((err) => console.log(err));
    };

    // gọi lần đầu
    fetchData();
    // gọi lại mỗi 5s
    intervalId = setInterval(fetchData, 5000);

    // cleanup
    return () => clearInterval(intervalId);
  }, []);

  // pick random products with smooth stagger animation
  const displayedProducts = useMemo(() => {
    const arr = Array.isArray(listProduct) ? [...listProduct] : [];

    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const limit = 8;
    return arr.slice(0, limit);
  }, [listProduct]);

  return (
    <>
      {/* Section Header */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <p className="uppercase text-sm font-semibold text-blue-600 tracking-widest mb-3">
              {t("homepage.bestProducts.subtitle")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("homepage.bestProducts.title")}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Featured Banner */}
          <div className="mb-12 group">
            <div className="relative h-80 md:h-96 rounded-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
              <img
                className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
                src={bannerImage}
                alt="Featured Collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-4">
                  <div className="inline-block mb-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      ✨ {t("homepage.banner.featured")}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t("homepage.banner.featured")}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base mb-5 max-w-md">
                    {t("homepage.bestProducts.subtitle")}
                  </p>
                  <Button
                    content={t("homepage.bestProducts.shopNow")}
                    hoverTextColor={"hover:text-white"}
                    bgColor={"bg-white"}
                    hoverBgColor={"hover:bg-transparent border-2 border-white"}
                    textColor={"text-black font-semibold"}
                  />
                </div>
              </div>

              <div className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-lg">
                🔥
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((item, idx) => (
              <div
                key={item._id || item.productCode || idx}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 80}ms both`
                }}
                className="group"
              >
                <div className="bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col py-5">
                  <Product item={item} />
                </div>
              </div>
            ))}
          </div>

          {/* Animation Definition */}
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default BestProducts;
