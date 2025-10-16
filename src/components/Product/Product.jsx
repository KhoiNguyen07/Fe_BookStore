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
import FavoriteItemAnimation from "../FavoriteItemAnimation/FavoriteItemAnimation";

const Product = ({ item, addCartBtn = false, setIsLoadingFunction }) => {
  const { images, name, brand, price, _id } = item;
  const [loading, setLoading] = useState(false);
  const {
    setIsOpenSidebar,
    setTitleSidebar,
    titleSidebar,
    setCurrentItemToSee
  } = useContext(SidebarContext);
  const [isWishList, setIsWishList] = useState(false);
  const { listItemFavorite, handleFavoriteItem } = useContext(StoreContext);

  useEffect(() => {
    setIsWishList(handleFavoriteItem(listItemFavorite, _id));
  }, [listItemFavorite]);

  const { formatVND } = useStransferToVND();
  const navigate = useNavigate();
  // handle navigate to detail product
  const handleToDetailProduct = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/product/${_id}`);
    }, 1000);
  };

  // handle add to cart
  const { handleAddToCart } = useAddToCart(item);

  // handle add to favorite
  const { handleToFavorite } = useAddToFavorite(item, isWishList);

  return (
    <>
      {loading && <Loading />}
      <div className="w-full overflow-hidden">
        <div className="group relative">
          <img
            src={images[0]}
            alt={name}
            className="cursor-pointer w-[300px] h-auto transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <img
            onClick={handleToDetailProduct}
            src={images[1]}
            alt={name}
            className="cursor-pointer w-[300px] h-auto  absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-50"
          />
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
                      setTitleSidebar({ ...titleSidebar, title: "see" });
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
            <h2 className="text-xl mt-3">{name}</h2>
            <p className="text-third"> {formatVND(price)}</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2">
            <h2 className="text-xl mt-3">{name}</h2>
            <p className="text-third">{brand}</p>
            <p className="text-third"> {formatVND(price)}</p>
            <Button
              onClick={handleAddToCart}
              content={"ADD TO CARD"}
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
