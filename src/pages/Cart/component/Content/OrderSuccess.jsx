import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animation from "~/assets/animation/successPaymentAnimation.json";
import Button from "~/components/Button/Button";
import { useNavigate } from "react-router-dom";
import Loading from "~/components/Loading/Loading";

const OrderSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const navigate = useNavigate();
  return (
    <>
      {isLoading && <Loading />}
      <div>
        <div className="flex flex-col text-center items-center justify-center space-y-5 h-full">
          <div className="w-[300px] xl:w-[500px]">
            <Lottie animationData={animation} loop={true} />
          </div>
          <h2 className="text-xl">
            Payment successful! Your order is being processed{" "}
          </h2>
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                navigate("/");
              }}
              content={"Go back to shop"}
            />
            <Button
              onClick={() => {
                navigate("/order");
              }}
              content={"See your order status"}
              hoverTextColor={"hover:text-white"}
              bgColor={"bg-transparent"}
              hoverBgColor={"hover:bg-black"}
              textColor={"text-black"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
