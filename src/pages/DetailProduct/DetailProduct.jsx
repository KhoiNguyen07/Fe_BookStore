import React, { useContext, useEffect, useState } from "react";
import Header from "~/components/Header/Header";
import SubRoute from "./component/SubRoute";
import MainContentDetail from "./component/MainContentDetail";
import RelatedProduct from "./component/RelatedProduct";
import Footer from "~/components/Footer/Footer";
import { productService } from "~/apis/productService";
import { useParams } from "react-router-dom";
import { SearchContext } from "~/contexts/SearchProvider";
import BannerTimerCountdown from "~/components/BannerTimerCountdown/BannerTimerCountdown";
import bannerImage from "~/assets/images/detail/bannerDetailProduct.webp";

const DetailProduct = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { setIsOpenSearchFunction } = useContext(SearchContext);
  console.log(id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpenSearchFunction(false);
    productService
      .getById(id)
      .then((res) => {
        console.log(res);
        setProduct(res.data.data);
      })
      .catch();
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    if (product?.categoryCode) {
      productService
        .getAllProduct()
        .then((res) => {
          const allProducts = res?.data?.data || [];
          // Filter products with same categoryCode, exclude current product, limit to 4
          const related = allProducts
            .filter(
              (p) =>
                p.categoryCode === product.categoryCode &&
                (p._id || p.productCode) !==
                  (product._id || product.productCode)
            )
            .slice(0, 4);
          setRelatedProducts(related);
        })
        .catch((err) => console.log("Error fetching related products:", err));
    }
  }, [product]);

  // const product = {
  //   _id: "SP001",
  //   name: "Atlas",
  //   author: "F. Scott Fitzgerald",
  //   category: "Fiction",
  //   description:
  //     "A classic novel that explores themes of wealth, love, and the American Dream.",
  //   price: 250,
  //   formats: ["Hardcover", "Paperback", "Ebook"],
  //   images: ["/product_img/p1/1.jpg", "/product_img/p1/2.jpg"],
  //   relativeProduct: [
  //     {
  //       _id: "64f100000000000000000002",
  //       name: "Đũa",
  //       author: "James Clear",
  //       category: "Self-help",
  //       description:
  //         "A guide to building good habits, breaking bad ones, and mastering small behaviors for remarkable results.",
  //       price: 300,
  //       formats: ["Hardcover", "Paperback", "Ebook"],
  //       images: ["/product_img/p2/1.jpg", "/product_img/p2/2.jpg"]
  //     },
  //     {
  //       _id: "64f100000000000000000003",
  //       name: "Bóng Trăng Trắng Ngà",
  //       author: "Morgan Housel",
  //       category: "Finance",
  //       description:
  //         "Timeless lessons on wealth, greed, and happiness from real-world financial experiences.",
  //       price: 280,
  //       formats: ["Hardcover", "Paperback", "Ebook"],
  //       images: ["/product_img/p3/1.jpg", "/product_img/p3/2.jpg"]
  //     },
  //     {
  //       _id: "64f100000000000000000004",
  //       name: "Tứ Trần Huyên Lỉnh",
  //       author: "Harper Lee",
  //       category: "Classic Literature",
  //       description:
  //         "A profound story of racial injustice and moral growth in the American South.",
  //       price: 270,
  //       formats: ["Hardcover", "Paperback", "Ebook"],
  //       images: ["/product_img/p4/1.jpg", "/product_img/p4/2.jpg"]
  //     },
  //     {
  //       _id: "64f100000000000000000005",
  //       name: "1984",
  //       author: "Bức họa múa rối xương",
  //       category: "Dystopian",
  //       description:
  //         "A chilling portrayal of a totalitarian regime and the dangers of government surveillance.",
  //       price: 260,
  //       formats: ["Hardcover", "Paperback", "Ebook"],
  //       images: ["/product_img/p5/1.jpg", "/product_img/p5/2.jpg"]
  //     }
  //   ]
  // };

  return (
    <>
      {/* header */}
      <section>
        <Header />
      </section>

      {/* banner */}
      <section>
        <div className="md:h-[380px] border">
          <BannerTimerCountdown
            targetDate={"2030-12-21"}
            title={"Bringing Books & Readers Together"}
            btnContent={"Explore Now"}
            bannerImg={bannerImage}
          />
        </div>
      </section>

      {/* sub route */}
      <section className="container mt-5">
        <SubRoute />
      </section>
      {/* main content */}
      {product && (
        <section className="container mt-3 px-3 xl:px-0">
          <MainContentDetail product={product} />
        </section>
      )}

      {/* related product */}
      <section className="container mt-20 px-3 xl:px-0">
        <RelatedProduct relativeProduct={relatedProducts} />
      </section>

      {/* footer */}
      <section className="mt-28">
        <Footer />
      </section>
    </>
  );
};

export default DetailProduct;
