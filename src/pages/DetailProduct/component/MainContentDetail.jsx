import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputNumberCustom from "~/pages/Cart/component/InputNumberCustom/InputNumberCustom";
import Button from "~/components/Button/Button";
import { BsCart3 } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";

import { iconArr } from "~/assets/ContentArrProject/Footer/MenuAndIcon";
import { IoIosArrowDown } from "react-icons/io";
import { useAddToCart } from "~/hooks/useAddToCart";
import FavoriteItemAnimation from "../../../components/FavoriteItemAnimation/FavoriteItemAnimation";
import RatingCustom from "./RatingCustom";

import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useStransferToVND } from "~/hooks/useStransferToVND";
import { StoreContext } from "~/contexts/StoreProvider";
import { commentService } from "~/apis/commentService";
import CommentCustom from "./CommentCustom";
import InputCustom from "~/components/InputCustom/InputCustom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import Loading from "~/components/Loading/Loading";

const MainContentDetail = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComment, setIsResetComment] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [isShowRating, setIsShowRating] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { formatVND } = useStransferToVND();
  const { toast } = useContext(ToastifyContext);
  const { userInfo } = useContext(StoreContext);
  const { images, name, sizes, brand, category, price, description, _id } =
    product;

  const { handleAddToCart } = useAddToCart(product, selectedSize, quantity);
  Fancybox.bind("[data-fancybox]", {});

  useEffect(() => {
    commentService
      .findAllCommentByProductId(_id)
      .then((res) => {
        if (res.data.length > 0) {
          setListComment(res.data);
        } else {
          setListComment(null);
        }
      })
      .catch();
  }, [isResetComment]);

  const formik = useFormik({
    initialValues: {
      review: ""
    },
    validationSchema: Yup.object({
      review: Yup.string().required("Please type your reviews!")
    }),
    onSubmit: (values) => {
      const data = {
        userId: userInfo._id,
        productId: _id,
        comment: values.review
      };
      commentService
        .createNew(data)
        .then((res) => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            toast.success(res.data.message);
            setIsResetComment((prev) => !prev);
            formik.resetForm();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-wrap xl:flex-nowrap gap-10">
        {/* Hình ảnh sản phẩm */}
        <div className="w-full xl:w-2/5">
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, i) => (
              <div key={i} className="overflow-hidden rounded relative group">
                <a href={image} data-fancybox data-caption={name}>
                  <img
                    src={image}
                    className="w-full h-auto object-cover rounded 
               transform transition-transform duration-500 ease-in-out 
               group-hover:scale-105 cursor-zoom-in"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full xl:w-3/5 flex flex-col space-y-3">
          <h2 className="text-3xl">{name}</h2>
          <p className="text-xl">{formatVND(price)}</p>
          <p>{description}</p>

          {/* Size */}
          <div>
            <p>Size {selectedSize}</p>
            <div className="mt-3 space-x-1">
              {sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedSize(item)}
                  className={`px-3 py-1 border text-xs transition ${
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

          {/* Số lượng + Add to cart */}
          <div className="flex items-center space-x-5">
            <div>
              <InputNumberCustom
                defaultValue={{ quantity: quantity, cartId: _id }}
                setQuantity={setQuantity}
              />
            </div>
            <div className="w-full">
              <Button
                onClick={handleAddToCart}
                w="w-full"
                content={
                  <div className="flex items-center space-x-3">
                    <BsCart3 />
                    <p>ADD TO CART</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* OR */}
          <div className="flex items-center space-x-3">
            <div className="border-t w-full"></div>
            <p>OR</p>
            <div className="border-t w-full"></div>
          </div>

          {/* Heart + Reload */}
          <div className="flex items-center space-x-3">
            <div className="relative flex justify-center items-center border rounded-full">
              <FavoriteItemAnimation product={product} p3="p-3" />
            </div>
            <span className="border p-3 cursor-pointer rounded-full">
              <TfiReload />
            </span>
          </div>

          {/* Safe checkout */}
          <div className="border px-20">
            <h2 className="text-center -translate-y-3 bg-white text-xl">
              GURANTED <span className="text-green-500">SAFE</span> CHECKOUT
            </h2>
            <div className="flex  justify-center items-center gap-5 mb-5 text-5xl">
              {iconArr.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>
          <h2 className="text-center mt-3">Your Payment is 100% Secure</h2>

          {/* Thông tin khác */}
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

          {/* additional information */}
          <div>
            {/* Header */}
            <div
              className="bg-gray-200 flex space-x-3 items-center px-2 py-1 cursor-pointer"
              onClick={() => setIsShowInfo(!isShowInfo)}
            >
              <span
                className={`transition-transform duration-500 ease-in-out ${
                  isShowInfo ? "-rotate-180" : "rotate-0"
                }`}
              >
                <IoIosArrowDown />
              </span>
              <h2>ADDITIONAL INFORMATION</h2>
            </div>

            {/* Content */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isShowInfo ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <table className="w-full text-third">
                <tbody>
                  <tr className="border-b h-20">
                    <td>Size</td>
                    <td>
                      {sizes.map((item, index) => (
                        <span key={index}>
                          {item}
                          {index < sizes.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* rating */}
          <div>
            {/* Header */}
            <div
              className="bg-gray-200 flex space-x-3 items-center px-2 py-1 cursor-pointer"
              onClick={() => setIsShowRating(!isShowRating)}
            >
              <span
                className={`transition-transform duration-500 ease-in-out ${
                  isShowRating ? "-rotate-180" : "rotate-0"
                }`}
              >
                <IoIosArrowDown />
              </span>
              <h2>Rating reviews ({listComment ? listComment.length : 0})</h2>
            </div>

            {/* Content */}
            <div
              className={`py-10 flex flex-col text-lg space-y-5 transition-all duration-500 ease-in-out overflow-hidden ${
                isShowRating
                  ? "max-h-[1500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <h2 className="border-b pb-5">Reviews</h2>
              {listComment ? (
                listComment.map((item) => {
                  return (
                    <CommentCustom
                      item={item}
                      userInfo={userInfo}
                      setIsResetComment={setIsResetComment}
                    />
                  );
                })
              ) : (
                <p className="text-third">There are no reviews yet.</p>
              )}

              <p className="pt-20 border-b pb-5">
                Be the first to review “10K Yellow Gold”
              </p>
              <p className="text-third">
                Your email address will not be published. Required fields are
                marked
              </p>

              {userInfo ? (
                <div className="flex flex-col space-y-5">
                  {/* rating star */}
                  {/* <div>
                    <h2>
                      Your rating <span className="text-red-500">*</span>
                    </h2>
                    <div>
                      <RatingCustom />
                    </div>
                  </div> */}
                  {/* review */}
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <h2>
                        Your review <span className="text-red-500">*</span>
                        <div>
                          <textarea
                            className="border w-full p-5 text-lg outline-none"
                            name="review"
                            rows={7}
                            value={formik.values.review}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />

                          {formik.touched.review && formik.errors.review ? (
                            <p className="text-red-500 text-sm mt-1">
                              {formik.errors.review}
                            </p>
                          ) : null}
                        </div>
                      </h2>
                    </div>

                    <div className="mt-10">
                      <Button type="submit" content={"SUBMIT"} />
                    </div>
                  </form>
                </div>
              ) : (
                <p>Login your account to review this item!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContentDetail;
