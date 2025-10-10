import React, { use, useContext, useEffect, useRef, useState } from "react";
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

const listCoupon = [
  {
    code: "FA20",
    value: 0.8
  },
  {
    code: "FA50",
    value: 0.5
  }
];

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

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  const { toast } = useContext(ToastifyContext);
  const handleCoupon = (code) => {
    if (code === "") return null;

    const found = listCoupon.find((item) => item.code === code);
    return found ? found : "unvalid";
  };
  const deleteCart = (cartId) => {
    showConfirmToast({
      message: "Are you sure delete this item?",
      onConfirm: () => {
        cartService
          .deleteCart({ cartId })
          .then(() => {
            toast.success("Delete successfully!");
          })
          .catch();
      }
    });
  };
  const deleteAllCart = () => {
    showConfirmToast({
      message: "Are you sure delete all cart?",
      onConfirm: () => {
        cartService.deleteAllCart();
      }
    });
  };

  useEffect(() => {
    if (userInfo) {
      cartService
        .getAllCart({ userId: userInfo._id })
        .then((res) => {
          setListItemCart(res.data);
          setCountItem(totalItem(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCountItem(0);
    }
  }, [listItemCart]);

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
                  {listItemCart?.map((items) => {
                    const { item } = items;
                    const { image, name, price, quantity, size, productId } =
                      item;

                    return (
                      <tr className="border-b">
                        <td className="py-5">
                          <div className="flex space-x-5 items-start">
                            <img src={image} className="w-24" alt="product" />
                            <div className="text-xl">
                              <h2 className="text-2xl">{name}</h2>
                              <p>
                                Size: <span className="text-third">{size}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            deleteCart(items._id);
                          }}
                          className="cursor-pointer text-center align-top py-6"
                        >
                          <FaRegTrashAlt />
                        </td>
                        <td className="text-center align-top py-5">
                          {formatVND(price)}
                        </td>
                        <td className="text-center align-top py-5">
                          {productId.slice(-5)}
                        </td>
                        <td className="text-center align-top py-5">
                          <InputNumberCustom
                            defaultValue={{
                              quantity: quantity,
                              cartId: items._id
                            }}
                            inCart={true}
                          />
                        </td>
                        <td className="text-center align-top py-5">
                          {formatVND(price * quantity)}
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
                  {listItemCart?.map((items) => {
                    const { item } = items;
                    const { image, name, price, quantity, size, productId } =
                      item;
                    return (
                      <>
                        <div
                          key={productId}
                          className="p-4 rounded-lg flex space-x-4 relative"
                        >
                          {/* Hình bên trái */}
                          <img
                            src={image}
                            className="w-24 h-24 object-cover flex-shrink-0"
                            alt="product"
                          />

                          {/* Thông tin bên phải */}
                          <div className="flex flex-col space-y-3 flex-1">
                            <h2 className="text-lg font-semibold border-b pb-3 border-dashed">
                              {name}
                            </h2>

                            <p className="border-b pb-3 border-dashed">
                              Size: <span className="text-third">{size}</span>
                            </p>

                            <p className="border-b pb-3 border-dashed">
                              SKU: {productId.slice(-5)}
                            </p>

                            <div className="flex items-center pb-3 space-x-2 border-b border-dashed">
                              <span>Quantity:</span>
                              <InputNumberCustom
                                defaultValue={{
                                  quantity: quantity,
                                  cartId: items._id
                                }}
                              />
                              <span className="text-xs">
                                x {formatVND(price)}
                              </span>
                            </div>

                            <p className="border-b pb-3 border-dashed">
                              Total: {formatVND(price * quantity)}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              deleteCart(items._id);
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
              <div className="flex justify-between">
                <h2>Coupon code: </h2>
                <p>{coupon?.code}</p>
              </div>
              <div className="flex justify-between">
                <h2 className="text-3xl font-bold">TOTAL: </h2>
                <p className="text-xl font-bold">
                  {coupon != null && coupon != "unvalid"
                    ? formatVND(totalPrice(listItemCart) * coupon.value)
                    : formatVND(totalPrice(listItemCart))}
                </p>
              </div>
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
