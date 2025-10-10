import React, { useEffect, useState } from "react";
import { productService } from "~/apis/productService";
import Product from "~/components/Product/Product";

const Suggest = () => {
  const [listProduct, setListProduct] = useState(null);
  useEffect(() => {
    productService
      .getAllProduct()
      .then((res) => {
        setListProduct(res.data);
      })
      .catch();
  }, []);
  return (
    <div className="px-5 xl:px-0 mt-20 container flex flex-col space-y-5 mb-40">
      <h2 className="text-2xl font-bold text-center">See More</h2>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {listProduct
          ?.sort(() => Math.random() - 0.5) // trộn ngẫu nhiên
          .slice(0, 4) // lấy 4 phần tử
          .map((item, index) => (
            <Product key={index} item={item} />
          ))}
      </div>
    </div>
  );
};

export default Suggest;
