import React, { useState } from "react";
// import "./style.scss";

const Button = ({
  content,
  type = "button",
  bgColor = "bg-black",
  textColor = "text-white",
  hoverBgColor = "hover:bg-transparent",
  hoverTextColor = "hover:text-black",
  border = "border-black",
  textsize = "text-md",
  px = "px-14",
  py = "py-2",
  w = "",
  borderRadius = "rounded-sm",
  onClick = () => {}
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setLoading(true);

          // Sau 3 giây tắt loading
          setTimeout(() => {
            setLoading(false);
          }, 200);

          onClick();
        }}
        type={type}
        className={` transition duration-300 border ${borderRadius} ${textsize} ${w} ${px} ${py} ${border} ${hoverBgColor} ${hoverTextColor} ${bgColor} ${textColor} pointer-events-auto`}
      >
        <div className="flex flex-col justify-center items-center h-full w-full relative pointer-events-auto">
          <p
            className={` ${
              loading ? "opacity-0" : "opacity-100"
            } text-xs lg:text-lg`}
          >
            {content}
          </p>
          <div
            className={`${
              loading ? "block" : "hidden"
            } absolute w-5 h-5 border-4 border-gray-300 border-t-black rounded-full animate-spin`}
          ></div>
        </div>
      </button>
    </>
  );
};

export default Button;
