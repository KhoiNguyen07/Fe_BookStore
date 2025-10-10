import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "~/components/Button/Button";
import { StoreContext } from "~/contexts/StoreProvider";

const EmptySidebar = ({ title }) => {
  const { userInfo } = useContext(StoreContext);
  return (
    <>
      {userInfo ? (
        <div className="w-full text-center mt-3 flex flex-col space-y-5">
          <h2>No products in the {title}.</h2>
          <Link to={""}>
            <Button
              content={"RETURN TO SHOP"}
              hoverTextColor={"hover:text-white"}
              bgColor={"bg-transparent"}
              hoverBgColor={"hover:bg-black"}
              textColor={"text-black"}
            />
          </Link>
        </div>
      ) : (
        <div className="w-full text-center mt-3 flex flex-col space-y-5">
          <h2>Sign in your account first</h2>
          <Link to={""}>
            <Button
              content={"RETURN TO SHOP"}
              hoverTextColor={"hover:text-white"}
              bgColor={"bg-transparent"}
              hoverBgColor={"hover:bg-black"}
              textColor={"text-black"}
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default EmptySidebar;
