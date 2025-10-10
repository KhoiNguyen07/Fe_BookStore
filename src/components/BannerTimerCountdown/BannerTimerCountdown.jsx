import React from "react";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import Button from "../Button/Button";

const BannerTimerCountdown = ({
  targetDate,
  title,
  btnContent,
  bannerImg,
  gridColSpan = ""
}) => {
  return (
    <div
      className={`${gridColSpan} h-full`}
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="border relative  h-60 md:h-full">
        <div className="overlay absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-10"></div>
        <div className="flex flex-col items-center justify-center space-y-3 h-full relative z-20">
          <div className="hidden md:block">
            <CountdownTimer targetDate={targetDate} />
          </div>
          <h2 className="xl:text-4xl capitalize text-white">{title}</h2>
          <Button content={btnContent} />
        </div>
      </div>
    </div>
  );
};

export default BannerTimerCountdown;
