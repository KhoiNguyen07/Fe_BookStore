import React, { useEffect, useState } from "react";
import Product from "~/components/Product/Product";
import { productService } from "~/apis/productService";
import BannerTimerCountdown from "~/components/BannerTimerCountdown/BannerTimerCountdown";
import bannerImage from "~/assets/images/bannerBestProduct.webp";
import Loading from "~/components/Loading/Loading";
import Button from "~/components/Button/Button";
import { useLanguage } from "~/contexts/LanguageProvider";

const BestProducts = () => {
  const { t } = useLanguage();
  const listProduct = [
    {
      _id: "64f100000000000000000001",
      name: "Atlas",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      description:
        "A classic novel that explores themes of wealth, love, and the American Dream.",
      price: 250,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p1/1.jpg", "/product_img/p1/2.jpg"]
    },
    {
      _id: "64f100000000000000000002",
      name: "Đũa",
      author: "James Clear",
      category: "Self-help",
      description:
        "A guide to building good habits, breaking bad ones, and mastering small behaviors for remarkable results.",
      price: 300,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p2/1.jpg", "/product_img/p2/2.jpg"]
    },
    {
      _id: "64f100000000000000000003",
      name: "Bóng Trăng Trắng Ngà",
      author: "Morgan Housel",
      category: "Finance",
      description:
        "Timeless lessons on wealth, greed, and happiness from real-world financial experiences.",
      price: 280,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p3/1.jpg", "/product_img/p3/2.jpg"]
    },
    {
      _id: "64f100000000000000000004",
      name: "Tứ Trần Huyên Lỉnh",
      author: "Harper Lee",
      category: "Classic Literature",
      description:
        "A profound story of racial injustice and moral growth in the American South.",
      price: 270,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p4/1.jpg", "/product_img/p4/2.jpg"]
    },
    {
      _id: "64f100000000000000000005",
      name: "1984",
      author: "Bức họa múa rối xương",
      category: "Dystopian",
      description:
        "A chilling portrayal of a totalitarian regime and the dangers of government surveillance.",
      price: 260,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p5/1.jpg", "/product_img/p5/2.jpg"]
    },
    {
      _id: "64f100000000000000000006",
      name: "17 âm 1",
      author: "Tara Westover",
      category: "Biography",
      description:
        "A memoir about a woman who grows up in a strict, isolated family and pursues education against all odds.",
      price: 320,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p6/1.jpg", "/product_img/p6/2.jpg"]
    },
    {
      _id: "64f100000000000000000007",
      name: "Hồ Xuân Hương",
      author: "Paulo Coelho",
      category: "Philosophical Fiction",
      description:
        "A symbolic tale about following one’s dreams and listening to the heart’s desires.",
      price: 240,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p7/1.jpg", "/product_img/p7/2.jpg"]
    },
    {
      _id: "64f100000000000000000008",
      name: "Người đẹp ngủ mê",
      author: "Michelle Obama",
      category: "Memoir",
      description:
        "The inspiring life story of the former First Lady of the United States.",
      price: 350,
      formats: ["Hardcover", "Paperback", "Ebook"],
      images: ["/product_img/p8/1.jpg", "/product_img/p8/2.jpg"]
    }
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const [isAnimating, setIsAnimating] = useState(false);

  // Categories with translation keys
  const categoryKeys = [
    "all",
    "music",
    "architecture",
    "horror",
    "art",
    "romance",
    "poetry",
    "novel",
    "detective",
    "historical",
    "contemporary"
  ];

  // Get translated categories
  const categories = categoryKeys.map((key) => ({
    key,
    label: t(`homepage.bestProducts.categories.${key}`)
  }));

  // assign categories to products cyclically so each tab shows something in demo
  const productsWithCategory = React.useMemo(() => {
    return listProduct.map((p, idx) => ({
      ...p,
      category: categoryKeys[(idx % (categoryKeys.length - 1)) + 1]
    }));
  }, [listProduct]);

  const filteredProducts = React.useMemo(() => {
    if (activeCategory === "all") return productsWithCategory;
    return productsWithCategory.filter((p) => p.category === activeCategory);
  }, [productsWithCategory, activeCategory]);

  const handleTabClick = (cat) => {
    if (cat === activeCategory) return;
    setIsAnimating(true);
    // small delay to allow CSS transition (enter)
    setTimeout(() => setActiveCategory(cat), 80);
    setTimeout(() => setIsAnimating(false), 360);
  };
  // const [listProduct, setListProduct] = useState(null);

  // useEffect(() => {
  //   let intervalId;

  //   const fetchData = () => {
  //     productService
  //       .getAllProduct()
  //       .then((res) => {
  //         if (res.data && res.data.length > 0) {
  //           setListProduct(res.data);
  //           clearInterval(intervalId); // có data thì stop
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   // gọi lần đầu
  //   fetchData();
  //   // gọi lại mỗi 5s
  //   intervalId = setInterval(fetchData, 5000);

  //   // cleanup
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <>
      {/* {!listProduct && <Loading />} */}

      <div className="container md:flex md:justify-between ">
        <div className="hidden md:block border-t-4 border-double w-1/3"></div>
        <div className="flex flex-col text-center items-center justify-center -translate-y-5">
          <p className="uppercase text-third text-md">
            {t("homepage.bestProducts.subtitle")}
          </p>
          <h2 className="text-3xl font-bold">
            {t("homepage.bestProducts.title")}
          </h2>
        </div>
        <div className="hidden md:block border-t-4 border-double w-1/3"></div>
      </div>
      <div className="container px-4 mt-10">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleTabClick(cat.key)}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-black text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-5 items-start transition-all duration-300 ${
            isAnimating
              ? "opacity-60 -translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="col-span-2 row-span-2 relative h-64 md:h-96 lg:h-[820px] rounded-2xl shadow-lg transition-all duration-300 group">
            {/* Media wrapper: image scales only inside this box */}
            <div className="media-wrapper overflow-hidden rounded-2xl h-full">
              <img
                className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-110"
                src={bannerImage}
                alt="Featured Collection"
              />
            </div>

            {/* Gradient overlay (non-interactive) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>

            {/* Content overlay (separate from image so it won't scale). Make non-interactive so hovering it triggers parent hover; make CTA clickable. */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
              <div className="text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-semibold rounded-full">
                    ✨ {t("homepage.banner.featured")}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                  {t("homepage.banner.featured")}
                </h3>
                <p className="text-sm md:text-base text-gray-200 mb-4 opacity-90">
                  {t("homepage.bestProducts.subtitle")}
                </p>
                <div>
                  <Button
                    content={t("homepage.bestProducts.shopNow")}
                    hoverTextColor={"hover:text-white"}
                    bgColor={"bg-white"}
                    hoverBgColor={"hover:bg-transparent border-white"}
                    textColor={"text-black"}
                  />
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                🔥
              </div>
            </div>
          </div>

          {/* list product */}
          {filteredProducts?.map((item, idx) => (
            <div
              key={item._id || idx}
              className="transform transition-all duration-300 hover:-translate-y-1 h-full"
            >
              <Product item={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BestProducts;
