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
      firstName: "",
      lastName: "",
      country: "",
      streetAddress: "",
      city: "",
      email: "",
      phoneNumber: "",
      note: "",
      paymentMethod: "online"
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .max(50, "First name must be less than 50 characters"),
      lastName: Yup.string()
        .required("Last name is required")
        .max(50, "Last name must be less than 50 characters"),
      country: Yup.string().required("Country is required"),
      streetAddress: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(
          /^[0-9]{10,15}$/,
          "Phone number must be between 10 and 15 digits"
        )
        .required("Phone number is required"),
      note: Yup.string().max(500, "Note must be less than 500 characters"),
      paymentMethod: Yup.string().required("Payment method is required")
    }),
    onSubmit: (values) => {
      const products = listItemCart.map(({ item }) => {
        const data = {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          totalPrice: (item.quantity * item.price).toFixed(2)
        };
        return data;
      });

      const data = {
        ...values,
        userId: userInfo._id,
        coupon: coupon ? coupon.code : "",
        listProduct: products,
        totalPriceOrder: coupon
          ? totalPrice(listItemCart) * coupon.value
          : totalPrice(listItemCart)
      };

      orderService
        .createOrder(data)
        .then((res) => {
          setOrderFunction(res.data);
          setCurrentTab(2);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something wrong. Try it later!");
        });
    }
  });

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
            {/* billing details */}
            <div>
              <h2 className="pt-10 pb-3 border-b-2 uppercase text-xl">
                billing details
              </h2>
              {/* form */}
              <div className="mt-5">
                {/*name input  */}
                <div className="flex justify-between space-x-10">
                  <div className="flex-1">
                    <InputCustom
                      id={"firstName"}
                      label={"First name"}
                      type={"text"}
                      placeholder={"First name"}
                      require={true}
                      formik={formik}
                    />
                  </div>
                  <div className="flex-1">
                    <InputCustom
                      id={"lastName"}
                      label={"Last name"}
                      type={"text"}
                      placeholder={"Last name"}
                      require={true}
                      formik={formik}
                    />
                  </div>
                </div>
                {/* Country region */}
                <div className="">
                  <InputCustom
                    id={"country"}
                    label={"Country / Region"}
                    type={"text"}
                    placeholder={"Country / Region"}
                    require={true}
                    formik={formik}
                  />
                </div>
                {/* Street address */}
                <div className="">
                  <InputCustom
                    id={"streetAddress"}
                    label={"Street Address"}
                    type={"text"}
                    placeholder={"House number and street name"}
                    require={true}
                    formik={formik}
                  />
                </div>
                {/* town city */}
                <div className="">
                  <InputCustom
                    id={"city"}
                    label={"Town / City"}
                    type={"text"}
                    placeholder={"Town / City"}
                    require={true}
                    formik={formik}
                  />
                </div>
                {/* email */}
                <div className="">
                  <InputCustom
                    id={"email"}
                    label={"Email Address"}
                    type={"text"}
                    placeholder={"Email address"}
                    require={true}
                    formik={formik}
                  />
                </div>
                {/* phone number */}
                <div className="">
                  <InputCustom
                    id={"phoneNumber"}
                    label={"Phone"}
                    type={"text"}
                    placeholder={"Phone"}
                    require={true}
                    formik={formik}
                  />
                </div>
                {/* note */}
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
                    placeholder="Notes about your order, e.g. special notes for delivery."
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
              {listItemCart.map((items) => {
                const { item } = items;
                const { image, name, price, quantity, size } = item;
                return (
                  <div className="flex space-x-5 ">
                    <img src={image} alt="" className="w-28 h-32" />
                    <div className="flex flex-col space-y-2">
                      <h2 className="text-xl font-bold">{name}</h2>
                      <p>
                        {quantity} * {formatVND(price)}
                      </p>
                      <p>Size: {size}</p>
                      <p>total: {formatVND(quantity * price)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="w-full border"></div>
              {/* subtotal */}
              <div className="flex justify-between">
                <h2>Total price: </h2>
                <p>{formatVND(totalPrice(listItemCart))}</p>
              </div>
              <div className="flex justify-between">
                <h2>Coupon code: </h2>
                <p>{coupon?.code}</p>
              </div>
              <div className="flex justify-between text-xl uppercase font-bold">
                <h2>Total: </h2>
                <p>
                  {coupon != null && coupon != "unvalid"
                    ? formatVND(totalPrice(listItemCart) * coupon.value)
                    : formatVND(totalPrice(listItemCart))}
                </p>
              </div>
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
