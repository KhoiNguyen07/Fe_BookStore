import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productIcon } from "~/assets/ContentArrProject/ListProduct/ListProduct";
import Button from "../Button/Button";
import { SidebarContext } from "~/contexts/SidebarProvider";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "~/hooks/useAddToCart";
import Loading from "../Loading/Loading";
import { StoreContext } from "~/contexts/StoreProvider";
import { useAddToFavorite } from "~/hooks/useAddToFavorite";
import { useStransferToVND } from "~/hooks/useStransferToVND";
import { buildImageUrl } from "~/lib/utils";
import FavoriteItemAnimation from "../FavoriteItemAnimation/FavoriteItemAnimation";

const Product = ({ item, addCartBtn = false, setIsLoadingFunction }) => {
  // support both API shape and original shape
  const { image, productName, categoryCode, price = 1, productCode } = item;
  const [loading, setLoading] = useState(false);

  const {
    setIsOpenSidebar,
    setTitleSidebar,
    titleSidebar,
    setCurrentItemToSee
  } = useContext(SidebarContext);
  const [isWishList, setIsWishList] = useState(false);
  const { listItemFavorite, handleFavoriteItem } = useContext(StoreContext);

  // useEffect(() => {
  //   setIsWishList(handleFavoriteItem(listItemFavorite, _id));
  // }, [listItemFavorite]);

  const { formatVND } = useStransferToVND();
  const navigate = useNavigate();
  // compute id and handle navigate to detail product
  const handleToDetailProduct = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/product/${productCode}`);
    }, 300);
  };

  // handle add to cart
  const { handleAddToCart } = useAddToCart(item);

  // handle add to favorite
  // const { handleToFavorite } = useAddToFavorite(item, isWishList);

  return (
    <>
      {loading && <Loading />}
      <div className="w-full">
        {/* Make the interactive image container clip scaled image and keep rounded corners */}
        <div className="group relative border cursor-pointer overflow-hidden ">
          <img
            src={buildImageUrl(image)}
            alt={productName}
            className="w-full h-[600px] transition-transform duration-500 ease-in-out group-hover:scale-105 object-cover"
          />
          <div
            onClick={handleToDetailProduct}
            className="absolute top-0 left-0 w-full h-full bg-black/20 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          ></div>
          {/* sidebar on hover */}
          <div
            className="absolute bottom-5 right-5 bg-white 
               opacity-0 translate-x-[20px] invisible 
               group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible 
               transition-all duration-500"
          >
            <p className="hover:bg-gray-200 duration-300 transition-colors cursor-pointer flex items-center justify-center">
              <FavoriteItemAnimation product={item} p3="p-3" />
            </p>
            {productIcon.map((itemIcon, index) => (
              <p
                onClick={() => {
                  switch (itemIcon.code) {
                    case "see":
                      setIsOpenSidebar(true);
                      setTitleSidebar({
                        ...titleSidebar,
                        title: "see",
                        key: "see"
                      });
                      setCurrentItemToSee(item);
                      return;
                    case "detail":
                      handleToDetailProduct();
                      return;
                    default:
                      return <p>Chưa có trạng thái.</p>;
                  }
                }}
                key={index}
                className={`p-3 hover:bg-gray-200 duration-300 transition-colors cursor-pointer`}
              >
                {itemIcon.icon}
              </p>
            ))}
          </div>
        </div>

        {!addCartBtn ? (
          <div className="flex flex-col justify-center space-y-2 text-center">
            <h2 className="text-xl mt-3 max-w-[240px] mx-auto truncate">
              {productName}
            </h2>
            <p className="text-third"> {formatVND(price)}</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2">
            <h2 className="text-xl mt-3 max-w-[240px] mx-auto truncate">
              {productName}
            </h2>
            <p className="text-third">
              {/* {category || categoryCode || "Unknown Category"} */}
            </p>
            <p className="text-third"> {formatVND(price)}</p>
            <Button
              onClick={handleAddToCart}
              content={"ADD TO CART"}
              px={"px-10"}
              py={"py-2"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Product;
