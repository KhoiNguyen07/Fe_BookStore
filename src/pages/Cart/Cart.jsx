import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import Step from "./component/Step";

import Footer from "~/components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ShoppingCart from "./component/Content/ShoppingCart";
import Checkout from "./component/Content/Checkout";
import { StoreContext } from "~/contexts/StoreProvider";
import Button from "~/components/Button/Button";
import OrderPayment from "./component/Content/OrderPayment";

const contentArr = [
  {
    number: 1,
    step: "shopping cart",
    display: <ShoppingCart />
  },
  {
    number: 2,
    step: "checkout",
    display: <Checkout />
  },
  {
    number: 3,
    step: "order status",
    display: <OrderPayment />
  }
];

const Cart = () => {
  const { currentTab, setCurrentTab, listItemCart } = useContext(StoreContext);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const found = contentArr.find((item) => item.number - 1 == currentTab);
    setContent(found.display);
  }, [currentTab]);

  const navigate = useNavigate();

  return (
    <>
      {listItemCart?.length > 0 ? (
        <div>
          {/* header */}
          <section>
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="cursor-pointer flex space-x-3 items-center px-5 py-3"
            >
              <FaArrowLeftLong />
              <p>Back to shop</p>
            </div>
          </section>
          {/* step */}
          <section>
            <Step
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              contentArr={contentArr}
            />
          </section>
          {/* content */}
          <section className="container mt-10 px-3 xl:px-0">{content}</section>
          {/* footer */}
          <section className="mt-20">
            <Footer />
          </section>
        </div>
      ) : (
        <div className="h-screen flex flex-col text-center justify-center items-center space-y-3">
          <span className="text-7xl">
            <MdOutlineShoppingCart />
          </span>
          <h2 className="text-3xl">YOUR SHOPPING CART IS EMPTY</h2>
          <p>
            We invite you to get acquainted with an assortment of out shop.
            Surely you can find something for yourself!
          </p>
          <Button
            onClick={() => {
              navigate("/shop");
            }}
            content={"Go to shop"}
          />
        </div>
      )}
    </>
  );
};

export default Cart;
