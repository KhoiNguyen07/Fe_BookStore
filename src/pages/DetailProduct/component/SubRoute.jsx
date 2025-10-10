import React from "react";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const SubRoute = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="px-2 md:px-0 flex items-center space-x-2">
        <Link to={"/"}>
          <button className="text-third">Home</button>
        </Link>
        <div>
          <MdArrowForwardIos />
        </div>
        <h2>Product</h2>
      </div>

      <div
        onClick={() => {
          navigate(-1);
        }}
        className="hidden md:flex items-center space-x-2 cursor-pointer text-third"
      >
        <div>
          <MdOutlineArrowBackIos />
        </div>
        <h2>Return to previos page</h2>
      </div>
    </div>
  );
};

export default SubRoute;
