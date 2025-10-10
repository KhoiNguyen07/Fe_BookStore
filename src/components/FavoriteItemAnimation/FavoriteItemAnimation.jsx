import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from "~/contexts/StoreProvider";
import { useAddToFavorite } from "~/hooks/useAddToFavorite";
import Loading from "../Loading/Loading";

const FavoriteItemAnimation = ({ product, p3 = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isWishList, setIsWishList] = useState(false);
  const { listItemFavorite, handleFavoriteItem } = useContext(StoreContext);

  useEffect(() => {
    setIsWishList(handleFavoriteItem(listItemFavorite, product._id));
  }, [listItemFavorite]);

  const { handleToFavorite } = useAddToFavorite(product, isWishList);

  const handleClick = () => {
    // tạo 4 trái tim nhỏ
    const newHearts = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60, // lệch trái/phải
      y: -80 - Math.random() * 40, // bay cao
      scale: 0.8 + Math.random() * 0.5
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    handleToFavorite();

    setIsWishList(!isWishList);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {isLoading && <Loading />}

      <span
        onClick={handleClick}
        className={`cursor-pointer relative z-10 ${p3}`}
      >
        {isWishList ? <FaHeart className="text-black " /> : <FaRegHeart />}
      </span>

      {/* Hiệu ứng tim nhỏ */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: 0,
              x: heart.x,
              y: heart.y,
              scale: heart.scale,
              rotate: Math.random()
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() =>
              setHearts((prev) => prev.filter((h) => h.id !== heart.id))
            }
            className="absolute"
          >
            <FaHeart className="text-black" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

export default FavoriteItemAnimation;
