import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Button from "~/components/Button/Button";
import { BsCart3 } from "react-icons/bs";
import InputNumberCustom from "~/pages/Cart/component/InputNumberCustom/InputNumberCustom";
import { TfiReload } from "react-icons/tfi";
import { FaRegHeart } from "react-icons/fa";
import SliderCarousel from "~/components/SliderCarousel/SliderCarousel";
import { useAddToCart } from "~/hooks/useAddToCart";
import { buildImageUrl } from "~/lib/utils";

const SeeProduct = ({ product }) => {
  const { image, productName, categoryCode, price = 1, productCode } = product;
  const [quantity, setQuantity] = useState(1);

  const { handleAddToCart } = useAddToCart(product, quantity);

  return (
    <div className="flex flex-col space-y-3 px-5 pt-3 pb-10 overflow-y-scroll">
      {/* <SliderCarousel data={images} /> */}
      <div className="flex justify-center">
        <img src={buildImageUrl(image)} alt="" />
      </div>
      <h2 className="text-3xl">{productName}</h2>
      <p className="text-third">${price}</p>
      <p>{categoryCode}</p>

      <div className="flex items-center space-x-5">
        <div>
          <InputNumberCustom
            defaultValue={{
              quantity: quantity,
              cartId: productCode
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
        <p className="text-third">{productCode}</p>
      </div>
      <div className="flex space-x-3">
        <p>Category:</p>
        <p className="text-third">{categoryCode}</p>
      </div>
      <div className="flex space-x-3">
        <p>Brand:</p>
        <p className="text-third">{categoryCode}</p>
      </div>
      <div className="flex space-x-3">
        <p>Estimated delivery:</p>
        <p className="text-third">5 - 7 days</p>
      </div>
    </div>
  );
};

export default SeeProduct;
