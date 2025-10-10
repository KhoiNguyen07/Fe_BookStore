import React, { useContext, useEffect, useState } from "react";
import Header from "~/components/Header/Header";
import SubRoute from "./component/SubRoute";
import MainContentDetail from "./component/MainContentDetail";
import RelatedProduct from "./component/RelatedProduct";
import Footer from "~/components/Footer/Footer";
import { productService } from "~/apis/productService";
import { useParams } from "react-router-dom";
import { SearchContext } from "~/contexts/SearchProvider";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { setIsOpenSearchFunction } = useContext(SearchContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpenSearchFunction(false);
    productService
      .getById(id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch();
  }, [id]);

  return (
    <>
      {/* header */}
      <section>
        <Header />
      </section>
      {/* sub route */}
      <section className="container">
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
        <RelatedProduct relativeProduct={product?.relativeProduct} />
      </section>

      {/* footer */}
      <section className="mt-28">
        <Footer />
      </section>
    </>
  );
};

export default DetailProduct;
