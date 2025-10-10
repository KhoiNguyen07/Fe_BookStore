import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Footer from "~/components/Footer/Footer";
import MainContent from "./component/MainContent";
import Suggest from "./component/Suggest";

const Order = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* header */}
      <section>
        <div
          onClick={() => {
            navigate("/shop");
          }}
          className="cursor-pointer flex space-x-3 items-center px-5 py-3"
        >
          <FaArrowLeftLong />
          <p>Back to shop</p>
        </div>
      </section>
      {/* Order */}
      <section>
        <MainContent />
      </section>

      {/* Suggest */}
      <section>
        <Suggest />
      </section>
      {/* footer */}
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default Order;
