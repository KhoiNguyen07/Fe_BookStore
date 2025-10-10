import React from "react";

import BestProducts from "~/pages/HomePage/components/BestProducts/BestProducts";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import Banner from "./components/Banner/Banner";
import SaleHomePage from "./components/SaleHomePage/SaleHomePage";
import BannerDiscount from "./components/BannerDiscount/BannerDiscount";
import Gallery from "./components/Gallery/Gallery";
import BlogPreview from "./components/BlogPreview/BlogPreview";
import Contact from "./components/Contract/Contract";

const HomePage = () => {
  return (
    <>
      {/* Header */}
      <div className="relative  z-40">
        <section className="absolute top-0 left-0 right-0">
          <Header />
        </section>
      </div>
      <div className="space-y-28">
        {/* Banner */}
        <section>
          <Banner />
        </section>

        {/* BannerDiscount */}
        <section className="-translate-y-48 ">
          <BannerDiscount />
        </section>

        {/* Our best product */}
        <section className="container px-3">
          <BestProducts />
        </section>

        {/* blog */}
        <section>
          <BlogPreview />
        </section>

        {/* Gallery */}
        <section>
          <Gallery />
        </section>

        {/* Sale */}
        {/* <section>
          <SaleHomePage />
        </section> */}

        <section>
          <Contact />
        </section>

        {/* Footer */}
        <section>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default HomePage;
