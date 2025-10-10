import React, { useContext } from "react";
import { StoreContext } from "~/contexts/StoreProvider";

const Step = ({ currentTab, setCurrentTab, contentArr }) => {
  const { order } = useContext(StoreContext);
  return (
    <div className="bg-gray-100 py-5 xl:py-20 px-2 xl:px-20 text-third">
      <div className="xl:hidden flex justify-between items-center space-x-3">
        {contentArr.map((item, index) => (
          <>
            <div
              onClick={() => {
                setCurrentTab(index);
              }}
              className="flex justify-center items-center space-x-2 cursor-pointer"
            >
              <h2
                className={`h-10 w-10 flex justify-center items-center text-xs rounded-full  ${
                  currentTab >= index ? "bg-black text-white" : "border-x-2"
                }`}
              >
                {item.number}
              </h2>

              <h2
                className={`text-xs w-1/2 uppercase  ${
                  currentTab >= index ? " text-black " : ""
                }`}
              >
                {item.step}
              </h2>
            </div>
          </>
        ))}
      </div>

      <div className="hidden xl:flex justify-between items-center">
        {contentArr.map((item, index) => (
          <>
            {index > 0 && (
              <span className="border border-t-gray-400 w-64"></span>
            )}
            <div
              onClick={() => {
                order
                  ? setCurrentTab(index)
                  : index < 2 && setCurrentTab(index);
              }}
              className="flex justify-center items-center space-x-5 w-1/3 cursor-pointer"
            >
              <h2
                className={`h-12 w-12 flex justify-center items-center text-3xl rounded-full border ${
                  currentTab >= index ? "bg-black text-white" : ""
                }`}
              >
                {item.number}
              </h2>

              <h2
                className={`text-3xl uppercase ${
                  currentTab >= index ? " text-black " : ""
                }`}
              >
                {item.step}
              </h2>
            </div>
          </>
        ))}
      </div>
      <h2 className="text-md xl:text-xl text-center mt-5 xl:mt-20">
        Checkout now to make your style!
      </h2>
    </div>
  );
};

export default Step;
