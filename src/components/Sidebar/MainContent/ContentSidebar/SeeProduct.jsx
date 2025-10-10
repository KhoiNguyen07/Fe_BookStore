import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Button from "~/components/Button/Button";
import { BsCart3 } from "react-icons/bs";
import InputNumberCustom from "~/pages/Cart/component/InputNumberCustom/InputNumberCustom";
import { TfiReload } from "react-icons/tfi";
import { FaRegHeart } from "react-icons/fa";
import SliderCarousel from "~/components/SliderCarousel/SliderCarousel";
import { useAddToCart } from "~/hooks/useAddToCart";

const SeeProduct = ({ product }) => {
  const { images, name, sizes, brand, category, price, description, _id } =
    product;

  const [selectedSize, setSelectedSize] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const { handleAddToCart } = useAddToCart(product, selectedSize, quantity);

  return (
    <div className="flex flex-col space-y-3 px-5 pt-3 pb-10 overflow-y-scroll">
      <SliderCarousel data={images} />
      <h2 className="text-3xl">{name}</h2>
      <p className="text-third">${price}</p>
      <p>{description}</p>
      <div>
        <p>Size {selectedSize}</p>
        <div className="mt-3 space-x-1">
          {sizes.map((item) => (
            <button
              onClick={() => setSelectedSize(item)}
              className={`px-3 py-1 border text-xs transition
            ${
              selectedSize === item
                ? "border-black bg-black text-white"
                : "border-gray-300 hover:border-black"
            }`}
            >
              {item}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {selectedSize && (
            <motion.button
              key="clear-btn"
              type="button"
              onClick={() => setSelectedSize(null)}
              className="text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-5">
        <div>
          <InputNumberCustom
            defaultValue={{
              quantity: quantity,
              cartId: _id
            }}
            setQuantity={setQuantity}
          />
        </div>
        <div>
          <Button
            onClick={handleAddToCart}
            textsize="text-xs"
            content={
              <>
                <div className="flex items-center space-x-3">
                  <BsCart3 />
                  <p>ADD TO CART</p>
                </div>
              </>
            }
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="border-t w-full"></div>
        <p>OR</p>
        <div className="border-t w-full"></div>
      </div>

      <div className="flex items-center space-x-3">
        <span>
          <TfiReload />
        </span>
        <p>Add to compare</p>
      </div>
      <div className="flex items-center space-x-3">
        <span>
          <FaRegHeart />
        </span>
        <p>Add to wishlist</p>
      </div>
      <div className="flex space-x-3">
        <p>SKU:</p>
        <p className="text-third">{_id.slice(-5)}</p>
      </div>
      <div className="flex space-x-3">
        <p>Category:</p>
        <p className="text-third">{category}</p>
      </div>
      <div className="flex space-x-3">
        <p>Brand:</p>
        <p className="text-third">{brand}</p>
      </div>
      <div className="flex space-x-3">
        <p>Estimated delivery:</p>
        <p className="text-third">5 - 7 days</p>
      </div>
    </div>
  );
};

export default SeeProduct;
