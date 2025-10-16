import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Button from "~/components/Button/Button";
import InputCustom from "~/components/InputCustom/InputCustom";
import * as Yup from "yup";
import { iconArr } from "~/assets/ContentArrProject/Footer/MenuAndIcon";
import { StoreContext } from "~/contexts/StoreProvider";
import { orderService } from "~/apis/orderService";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { useNavigate } from "react-router-dom";
import { useStransferToVND } from "~/hooks/useStransferToVND";
import { buildImageUrl } from "~/lib/utils";

const paymentArr = [
  {
    code: "online",
    title: "Check payments",
    description:
      "Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode."
  },
  {
    code: "cash",
    title: "Cash on delivery",
    description: "Pay with cash upon delivery."
  }
];

const Checkout = () => {
  const { formatVND } = useStransferToVND();
  const { toast } = useContext(ToastifyContext);
  const {
    listItemCart,
    totalPrice,
    coupon,
    setCoupon,
    userInfo,
    setCurrentTab,
    setOrderFunction
  } = useContext(StoreContext);

  const [selectPayment, setSelectPayment] = useState("online");

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      promotionCode: "",
      address: "",
      paymentMethod: "online",
      note: ""
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(
          /^[0-9]{10,15}$/,
          "Phone number must be between 10 and 15 digits"
        )
        .required("Phone number is required"),
      promotionCode: Yup.string().max(
        50,
        "Promotion code must be less than 50 characters"
      ),
      address: Yup.string().required("Address is required"),
      paymentMethod: Yup.string().required("Payment method is required"),
      note: Yup.string().max(500, "Note must be less than 500 characters")
    }),
    onSubmit: (values) => {
      // Map cart items to details array with productCode and quantity
      const details = listItemCart.map((entry) => {
        const it = entry?.item ? entry.item : entry;
        const productCode =
          it.productCode || it.productId || it.id || it._id || "";
        const quantity = Number(it.quantity ?? it.qty ?? 1);

        return {
          productCode,
          quantity
        };
      });

      // Calculate discounts: member discount and coupon discount
      // Compute subtotal based on discounted prices (if item.discountValue provided)
      const subtotal =
        (listItemCart || []).reduce((acc, it) => {
          const unit = Number(it.unitPrice || it.price || 0);
          const discountPercent = Number(it.discountValue) || 0;
          const discountedPrice = unit * (1 - discountPercent);
          const qty = Number(it.quantity ?? it.qty ?? 1);
          return acc + discountedPrice * qty;
        }, 0) || 0;

      const memberDiscountPercent = Number(userInfo?.memberDiscount) || 0;
      const memberDiscountAmount = Number(
        (subtotal * memberDiscountPercent).toFixed(0)
      );
      const couponDiscountAmount =
        coupon && coupon !== "unvalid" && coupon.value
          ? Number((subtotal - subtotal * coupon.value).toFixed(0))
          : 0;

      const totalDiscount = memberDiscountAmount + couponDiscountAmount;

      // Collect promotion codes from products and user info
      const productPromotionCodes = (listItemCart || []).flatMap((entry) => {
        const it = entry?.item ? entry.item : entry;
        const p = it?.promotionCode || it?.promotion_code || it?.promotionCodes;
        if (!p) return [];
        return Array.isArray(p) ? p : [p];
      });

      // include promotion codes from userInfo.promotion_code (if present) + product-level codes
      const initialUserPromotions = userInfo?.promotion_code
        ? Array.isArray(userInfo.promotion_code)
          ? userInfo.promotion_code
          : [userInfo.promotion_code]
        : [];

      const promotionCodes = Array.from(
        new Set(
          [...initialUserPromotions, ...productPromotionCodes].filter(Boolean)
        )
      );

      const data = {
        customerCode:
          userInfo?.customerCode || userInfo?._id || userInfo?.userId || "",
        employeeCode: "",
        // promotionCodes: combine user-level promotions and product-level promotions
        promotionCodes: promotionCodes,
        orderType: "Online",
        paymentMethod: values.paymentMethod === "cash" ? "Cash" : "QR",
        phoneNumber: values.phoneNumber || "",
        // `discount` field will carry the coupon code (or empty string)
        discount:
          coupon && coupon !== "unvalid" && coupon.code ? coupon.code : "",
        note: values.note || "",
        address:
          values.address ||
          `${values.streetAddress || ""}, ${values.city || ""}`,
        details: details
      };

      orderService
        .createOrder(data)
        .then((res) => {
          setOrderFunction(res.data);
          setCurrentTab(2);
          toast.success("Order created successfully!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something wrong. Try it later!");
        });
    }
  });

  // no editable customerName field — customer name is taken from logged-in user info

  useEffect(() => {
    return () => {
      setCoupon(null);
    };
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap xl:flex-nowrap gap-3">
          <div className="w-full xl:w-4/6">
            {/* removed separate Customer Information section to match API payload structure */}

            {/* shipping & contact (simplified to match API) */}
            <div>
              <h2 className="pt-10 pb-3 border-b-2 uppercase text-xl">
                Shipping & Contact
              </h2>
              <div className="mt-5">
                {/* show logged in user name (not editable) */}
                {userInfo && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">
                      Recipient:{" "}
                      <strong>
                        {userInfo.customerName ||
                          userInfo.fullName ||
                          userInfo.name ||
                          userInfo.email}
                      </strong>
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <InputCustom
                    id={"phoneNumber"}
                    label={"Phone Number"}
                    type={"text"}
                    placeholder={"0912345678"}
                    require={true}
                    formik={formik}
                  />
                </div>

                <div className="mt-3">
                  <InputCustom
                    id={"address"}
                    label={"Delivery address"}
                    type={"text"}
                    placeholder={"123 Đường A, Quận B"}
                    require={true}
                    formik={formik}
                  />
                </div>

                {/* employeeCode removed — defaults to null in payload */}

                <h2 className="pt-3 pb-5 border-t-2 uppercase text-xl">
                  Additional Information
                </h2>
                <div>
                  <h2>Order notes (optional)</h2>
                  <textarea
                    id="note"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.note}
                    className="border w-full p-5 text-xl"
                    name="note"
                    placeholder="Giao giờ hành chính"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-2/6">
            <div className="px-5 py-10 border-2 border-black space-y-5">
              <h2 className="text-xl">YOUR ORDER</h2>
              <div className="w-full border"></div>
              {/* list item */}
              {listItemCart.map((item) => {
                const {
                  id,
                  image,
                  productName,
                  unitPrice,
                  quantity,
                  productCode,
                  totalAmount,
                  discountValue
                } = item;

                // Calculate discounted price (discountValue is percentage)
                const discountPercent = Number(discountValue) || 0;
                const discountedPrice =
                  Number(unitPrice) * (1 - discountPercent);
                const displayedTotal = Number(quantity) * discountedPrice;

                return (
                  <div className="flex space-x-5" key={id || productCode}>
                    <img
                      src={buildImageUrl(image)}
                      alt=""
                      className="w-28 h-32"
                    />
                    <div className="flex flex-col space-y-2">
                      <h2 className="text-xl font-bold">{productName}</h2>
                      <p>
                        {quantity} *{" "}
                        {discountPercent > 0 ? (
                          <span className="flex flex-col">
                            <span className="line-through text-sm text-gray-400">
                              {formatVND(unitPrice)}
                            </span>
                            <span className="text-green-600">
                              {formatVND(discountedPrice)}
                            </span>
                            <span className="text-xs text-red-500">
                              -{Math.round(discountPercent * 100)}%
                            </span>
                          </span>
                        ) : (
                          <span>{formatVND(unitPrice)}</span>
                        )}
                      </p>
                      <p>total: {formatVND(displayedTotal)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="w-full border"></div>
              {/* totals and discounts */}
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
                  Number(userInfo?.memberDiscount) || 0;
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
                            : "text-gray-600"
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
                          <span className="text-red-500">-{formatVND(0)}</span>
                        )}
                      </p>
                    </div>

                    <div className="w-full border"></div>

                    <div className="flex justify-between text-xl uppercase font-bold">
                      <h2>Total: </h2>
                      <p>{formatVND(finalTotal)}</p>
                    </div>
                  </>
                );
              })()}
              <div className="w-full border"></div>
              {/* select box payment */}
              <div>
                {paymentArr.map((item) => (
                  <div className="text-third">
                    <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={item.code}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setSelectPayment(item.code);
                        }}
                        onBlur={formik.handleBlur}
                        checked={
                          selectPayment === item.code ||
                          formik.values.paymentMethod === item.code
                        } // check theo formik
                      />
                      <span
                        className={`${
                          item.code == selectPayment && "text-black"
                        } text-lg`}
                      >
                        {item.title}
                      </span>
                    </label>

                    <div
                      className={`transition-all duration-500 overflow-hidden ${
                        selectPayment == item.code
                          ? "max-h-20 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="px-5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* btn checkout */}
              <div>
                <Button type="submit" content={"PLACE ORDER"} w="w-full" />
                <div className="border py-5 px-10 mt-20">
                  <h2 className="text-center bg-white -translate-y-8 text-xl">
                    GURANTED <span className="text-green-500">SAFE</span>{" "}
                    CHECKOUT
                  </h2>
                  <div className="flex flex-wrap justify-center items-center gap-3 text-5xl ">
                    {iconArr.map((item) => (
                      <p>{item}</p>
                    ))}
                  </div>
                </div>
                <h2 className="text-center mt-3">
                  Your Payment is 100% Secure
                </h2>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Checkout;
