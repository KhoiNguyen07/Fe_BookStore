import React, { useContext, useEffect, useRef, useState } from "react";
import { buildImageUrl } from "~/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";

import InputNumberCustom from "../InputNumberCustom/InputNumberCustom";
import Button from "~/components/Button/Button";
import { iconArr } from "~/assets/ContentArrProject/Footer/MenuAndIcon";
import { StoreContext } from "~/contexts/StoreProvider";
import { showConfirmToast } from "~/utils/showConfirmToast";
import { cartService } from "~/apis/cartService";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import Loading from "~/components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useStransferToVND } from "~/hooks/useStransferToVND";

// coupons list removed — validation should come from backend. Default coupon/discount is null.

const ShoppingCart = () => {
  const { formatVND } = useStransferToVND();
  const [isEmptyCouponNotification, setIsEmptyCouponNotification] =
    useState("");
  const {
    userInfo,
    listItemCart,
    totalPrice,
    setListItemCart,
    setCountItem,
    totalItem,
    coupon,
    setCoupon,
    setCurrentTab
  } = useContext(StoreContext);

  console.log(listItemCart);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  const { toast } = useContext(ToastifyContext);
  const handleCoupon = (code) => {
    // No local coupon list — empty input => null, otherwise mark as unvalid
    if (!code || code.trim() === "") return null;
    return "unvalid";
  };
  const deleteCart = (cartId) => {
    console.log(cartId);
    showConfirmToast({
      message: "Are you sure delete this item?",
      onConfirm: () => {
        // cartService.deleteCart expects customerCode and productCode
        const customerCode =
          userInfo?.customerCode || userInfo?._id || userInfo?.userId || null;
        if (!customerCode) {
          toast.error("User not identified. Please login.");
          return;
        }

        cartService
          .deleteCart({ customerCode, productCode: cartId })
          .then(() => {
            toast.success("Delete successfully!");
            fetchCart();
          })
          .catch(() => {
            toast.error("Failed to delete item");
          });
      }
    });
  };
  const deleteAllCart = () => {
    showConfirmToast({
      message: "Are you sure delete all cart?",
      onConfirm: () => {
        const customerCode =
          userInfo?.customerCode || userInfo?._id || userInfo?.userId || null;
        if (!customerCode) {
          toast.error("User not identified. Please login.");
          return;
        }

        cartService
          .deleteAllCart(customerCode)
          .then(() => {
            toast.success("All items deleted");
            fetchCart();
          })
          .catch(() => {
            toast.error("Failed to clear cart");
          });
      }
    });
  };
  // fetch cart helper
  const fetchCart = () => {
    if (!userInfo) {
      setListItemCart([]);
      setCountItem(0);
      return;
    }

    const customerCode =
      userInfo?.customerCode || userInfo?._id || userInfo?.userId || null;
    if (!customerCode) return;

    cartService
      .getAllCart(customerCode)
      .then((res) => {
        const list = res?.data?.data || res?.data || [];
        setListItemCart(list);
        setCountItem(totalItem(list));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCart();
  }, [userInfo]);

  return (
    <>
      {loading && <Loading />}

      {listItemCart && (
        <div className="flex flex-wrap">
          <div className="w-full xl:w-3/5">
            {/* Bản responsive */}
            <div className="hidden md:block overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">PRODUCT</th>
                    <th className="text-center"></th>
                    <th className="text-center">PRICE</th>
                    <th className="text-center">SKU</th>
                    <th className="text-center">QUANTITY</th>
                    <th className="text-center">TOTALPRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {listItemCart?.map((item) => {
                    const {
                      id,
                      image,
                      productCode,
                      productName,
                      quantity,
                      totalAmount,
                      unitPrice,
                      discountValue
                    } = item;

                    // Calculate discounted price (discountValue is percentage, e.g., 0.2 = 20%)
                    const discountPercent = Number(discountValue) || 0;
                    const discountedPrice =
                      Number(unitPrice) * (1 - discountPercent);
                    const displayedTotal = Number(quantity) * discountedPrice;

                    return (
                      <tr className="border-b">
                        <td className="py-5">
                          <div className="flex space-x-5 items-start">
                            <img
                              src={buildImageUrl(image)}
                              className="w-24"
                              alt="product"
                            />
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            deleteCart(productCode);
                          }}
                          className="cursor-pointer text-center align-top py-6"
                        >
                          <FaRegTrashAlt />
                        </td>
                        <td className="text-center align-top py-5">
                          {discountPercent > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="line-through text-sm text-gray-400">
                                {formatVND(unitPrice)}
                              </span>
                              <span className="text-sm text-green-600">
                                {formatVND(discountedPrice)}
                              </span>
                              <span className="text-xs text-red-500">
                                -{Math.round(discountPercent * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span>{formatVND(unitPrice)}</span>
                          )}
                        </td>
                        <td className="text-center align-top py-5">
                          {productCode}
                        </td>
                        <td className="text-center align-top py-5">
                          <InputNumberCustom
                            defaultValue={{
                              quantity: quantity,
                              productCode: productCode,
                              customerCode:
                                userInfo?.customerCode || userInfo?._id
                            }}
                            inCart={true}
                            onUpdated={fetchCart}
                          />
                        </td>
                        <td className="text-center align-top py-5">
                          {formatVND(displayedTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-4">
              <div className="border p-4 rounded-lg">
                <div className="block md:hidden space-y-4">
                  {listItemCart?.map((item) => {
                    const {
                      image,
                      productName,
                      unitPrice,
                      productCode,
                      quantity,
                      id,
                      totalAmount,
                      discountValue
                    } = item;

                    // Calculate discounted price (discountValue is percentage)
                    const discountPercent = Number(discountValue) || 0;
                    const discountedPrice =
                      Number(unitPrice) * (1 - discountPercent);
                    const displayedTotal = Number(quantity) * discountedPrice;

                    return (
                      <>
                        <div
                          key={id}
                          className="p-4 rounded-lg flex space-x-4 relative"
                        >
                          {/* Hình bên trái */}
                          <img
                            src={buildImageUrl(image)}
                            className="w-24 h-24 object-cover flex-shrink-0"
                            alt="product"
                          />

                          {/* Thông tin bên phải */}
                          <div className="flex flex-col space-y-3 flex-1">
                            <h2 className="text-lg font-semibold border-b pb-3 border-dashed">
                              {productName}
                            </h2>

                            <p className="border-b pb-3 border-dashed">
                              SKU: {productCode}
                            </p>

                            <div className="flex items-center pb-3 space-x-2 border-b border-dashed">
                              <span>Quantity:</span>
                              <InputNumberCustom
                                defaultValue={{
                                  quantity: quantity,
                                  productCode: productCode,
                                  customerCode:
                                    userInfo?.customerCode || userInfo?._id
                                }}
                                inCart={true}
                                onUpdated={fetchCart}
                              />
                              <span className="text-xs">
                                x{" "}
                                {discountPercent > 0 ? (
                                  <span className="flex flex-col">
                                    <span className="line-through text-gray-400">
                                      {formatVND(unitPrice)}
                                    </span>
                                    <span className="text-green-600">
                                      {formatVND(discountedPrice)}
                                    </span>
                                    <span className="text-red-500">
                                      -{Math.round(discountPercent * 100)}%
                                    </span>
                                  </span>
                                ) : (
                                  <span>{formatVND(unitPrice)}</span>
                                )}
                              </span>
                            </div>

                            <p className="border-b pb-3 border-dashed">
                              Total: {formatVND(displayedTotal)}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              deleteCart(productCode);
                            }}
                            className="absolute top-0 right-0"
                          >
                            <FaRegTrashAlt />
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-5 items-center mt-5">
              <div className="flex w-full xl:w-3/6">
                <div className="border h-10 px-5 focus-within:border-2 focus-within:border-r-0 focus-within:border-black flex-1 ">
                  <input
                    ref={inputRef}
                    placeholder="Coupon code"
                    className="h-full w-full text-xl outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      const couponValid = handleCoupon(inputRef.current.value);

                      couponValid
                        ? setIsEmptyCouponNotification(false)
                        : setIsEmptyCouponNotification(true);
                      setCoupon(couponValid);
                      setLoading(false);
                    }, 1000);
                  }}
                  className="border-black border-2 px-2 hover:bg-black hover:text-white transition-colors duration-200"
                >
                  OK
                </button>
              </div>

              <div className="w-full xl:w-2/6  text-center">
                <Button
                  onClick={deleteAllCart}
                  py={"py-2"}
                  w={"w-full"}
                  content={
                    <>
                      <div className="flex space-x-3 justify-center items-center">
                        <FaRegTrashAlt />
                        <p>CLEAR CART</p>
                      </div>
                    </>
                  }
                  hoverTextColor={"hover:text-white"}
                  bgColor={"bg-transparent"}
                  hoverBgColor={"hover:bg-black"}
                  textColor={"text-black"}
                />
              </div>
            </div>
            {isEmptyCouponNotification && <h2>Please enter your coupon</h2>}
            {coupon === "unvalid" ? <h2>Your coupon is unvalid</h2> : <h2></h2>}
          </div>

          <div className="w-full xl:w-2/5 px-5 mt-5">
            <div className="px-5 py-10 border-2 border-black space-y-5">
              <h2 className="border-b text-xl">CART TOTALS</h2>
              <div className="flex justify-between">
                <h2>Total price: </h2>
                <p>{formatVND(totalPrice(listItemCart))}</p>
              </div>
              {/* Discounts summary */}
              {(() => {
                // Compute original subtotal and discounted subtotal (discountValue is percent)
                const originalSubtotal =
                  (listItemCart || []).reduce((acc, it) => {
                    const unit = Number(it.unitPrice || it.price || 0);
                    const qty = Number(it.quantity ?? it.qty ?? 1);
                    return acc + unit * qty;
                  }, 0) || 0;

                const subtotal =
                  (listItemCart || []).reduce((acc, it) => {
                    const unit = Number(it.unitPrice || it.price || 0);
                    const discountPercent = Number(it.discountValue) || 0;
                    const discountedPrice = unit * (1 - discountPercent);
                    const qty = Number(it.quantity ?? it.qty ?? 1);
                    return acc + discountedPrice * qty;
                  }, 0) || 0;

                const productDiscountAmount = Math.max(
                  0,
                  originalSubtotal - subtotal
                );

                const memberDiscountPercent =
                  Number(userInfo?.memberDiscount) || 0; // e.g. 0.1 = 10%
                const memberDiscountAmount = Number(
                  (subtotal * memberDiscountPercent).toFixed(0)
                );
                const couponDiscountAmount =
                  coupon && coupon !== "unvalid" && coupon.value
                    ? Number((subtotal - subtotal * coupon.value).toFixed(0))
                    : 0;
                const finalTotal =
                  subtotal - memberDiscountAmount - couponDiscountAmount;

                return (
                  <>
                    <div className="flex justify-between">
                      <h2>Subtotal: </h2>
                      <p>{formatVND(subtotal)}</p>
                    </div>

                    <div>
                      <h2>Discount: </h2>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <h2>{userInfo?.customerTypeName}</h2>
                      <p>
                        <span className="text-red-500">
                          -{formatVND(memberDiscountAmount)}
                        </span>
                      </p>
                    </div>

                    {/* Product-level discounts (from discountValue on items) */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <h2>Product discounts</h2>
                      <p>
                        <span className="text-red-500">
                          -{formatVND(productDiscountAmount)}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <h2
                        className={
                          coupon && coupon !== "unvalid"
                            ? "font-medium"
                            : "text-gray-400"
                        }
                      >
                        {coupon && coupon !== "unvalid"
                          ? coupon.code
                          : "No coupon"}
                      </h2>
                      <p>
                        {coupon && coupon !== "unvalid" ? (
                          <span className="text-red-500">
                            -{formatVND(couponDiscountAmount)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </p>
                    </div>

                    <div className="w-full border"></div>

                    <div className="flex justify-between text-3xl uppercase font-bold">
                      <h2>Total: </h2>
                      <p className="text-xl font-bold">
                        {formatVND(finalTotal)}
                      </p>
                    </div>
                  </>
                );
              })()}
              <div className="flex flex-col space-y-3">
                <div>
                  <Button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        setCurrentTab(1);
                      }, 1000);
                    }}
                    type="submit"
                    content={"PROCEED TO CHECKOUT"}
                    w="w-full"
                  />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      navigate("/shop");
                    }}
                    content={"CONTINUE SHOPPING"}
                    w="w-full"
                    hoverTextColor={"hover:text-white"}
                    bgColor={"bg-transparent"}
                    hoverBgColor={"hover:bg-black"}
                    textColor={"text-black"}
                  />
                </div>
              </div>
            </div>

            {/* payment */}
            <div className="border py-5 px-10 mt-20">
              <h2 className="text-center bg-white -translate-y-8 text-xl">
                GURANTED <span className="text-green-500">SAFE</span> CHECKOUT
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-3 text-5xl ">
                {iconArr.map((item) => (
                  <p>{item}</p>
                ))}
              </div>
            </div>
            <h2 className="text-center mt-3">Your Payment is 100% Secure</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
