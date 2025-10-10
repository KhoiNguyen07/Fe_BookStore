import React, { useEffect, useRef, useState } from "react";
import BannerTimerCountdown from "~/components/BannerTimerCountdown/BannerTimerCountdown";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import SubRoutePage from "~/pages/OurShop/components/SubRoutePage/SubRoutePage";
import SortProduct from "~/pages/OurShop/components/SortProduct/SortProduct";
import ShowAllProduct from "~/pages/OurShop/components/ShowAllProduct/ShowAllProduct";
import bannerImage from "~/assets/images/bannerOurShop.jpeg";
import { productService } from "~/apis/productService";
import { useSorting } from "~/hooks/useSorting";
import Button from "~/components/Button/Button";

// arr select box
const sortArr = [
  { title: "Sort by price: low to high", value: "ascending" },
  { title: "Sort by price: high to low", value: "descending" }
];
const itemPerPageArr = [
  { title: "4", value: 4 },
  { title: "8", value: 8 },
  { title: "All", value: 0 }
];

const OurShop = () => {
  // List product from API
  const [listProduct, setListProduct] = useState([]);
  const [listProductRender, setListProductRender] = useState([]);
  const childRef = useRef();
  const updateSetListProductRender = (value) => {
    setListProductRender(value);
  };

  useEffect(() => {
    const { sortedList } = useSorting(
      listProduct,
      sortArr[0].value,
      itemPerPageArr[0].value
    );
    setListProductRender(sortedList());
  }, [listProduct]);

  // call api
  useEffect(() => {
    productService
      .getAllProduct()
      .then((res) => {
        setListProduct(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // loading more
  const handleLoadingMoreItem = () => {
    childRef.current.handleOnclickMoreItem();
  };

  return (
    <>
      <div className="container">
        {/* Header */}
        <section className="relative z-40">
          <Header />
        </section>

        {/* sub route navigate */}
        <section>
          <SubRoutePage />
        </section>

        {/* Banner our shop */}
        <section>
          <div className="md:h-[280px] border">
            <BannerTimerCountdown
              targetDate={"2030-12-21"}
              title={"The classics make a comeback"}
              btnContent={"Buy now"}
              bannerImg={bannerImage}
            />
          </div>
        </section>

        {/* Sorting */}
        <section>
          <SortProduct
            sortArr={sortArr}
            itemPerPageArr={itemPerPageArr}
            ref={childRef}
            listProduct={listProduct}
            updateSetListProductRender={updateSetListProductRender}
          />
        </section>
        {/* Show products */}
        <section className="px-3 md:px-0">
          <ShowAllProduct listProduct={listProductRender} />
        </section>
        {/* Loading more product */}
        {listProductRender.length != listProduct.length && (
          <section>
            {/* Loading more */}
            <div className="text-center pt-32">
              <Button
                onClick={handleLoadingMoreItem}
                content={"LOAD MORE PRODUCT"}
                hoverTextColor={"hover:text-white"}
                bgColor={"bg-transparent"}
                hoverBgColor={"hover:bg-black"}
                textColor={"text-black"}
              />
            </div>
          </section>
        )}
      </div>

      {/* footer */}
      <section className="mt-32">
        <Footer />
      </section>
    </>
  );
};

export default OurShop;
