import React from "react";
import Lottie from "lottie-react";
import animation from "~/assets/animation/pageNotFoundAnimation.json";
const PageNotFound = () => {
  return (
    <div className="w-full h-screen">
      <Lottie
        animationData={animation}
        loop={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PageNotFound;
