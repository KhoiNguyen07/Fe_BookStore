import React from "react";
import Button from "~/components/Button/Button";
import videoBanner from "~/assets/video/homepage/video_banner.mp4";
import "./style.scss";
import { useLanguage } from "~/contexts/LanguageProvider";

import { subBannerArr } from "~/assets/ContentArrProject/Banner/BannerContent";

const Banner = () => {
  const { t } = useLanguage();

  return (
    <>
      {/* Banner content */}
      <div className="Banner flex flex-col justify-center items-center text-center space-y-5 border px-5 text-white relative overflow-hidden">
        {/* video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoBanner}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        {/* overlay: extend upward under the fixed header so the video is fully covered */}
        <div className="absolute -top-5 left-0 w-full h-full bg-black/0 z-0 pointer-events-none"></div>
        {/* content */}
        <h2 className="z-20 text-5xl">{t("homepage.banner.title")}</h2>
        <p className="z-20 text-xl text-third">
          {t("homepage.banner.subtitle")}
        </p>
        <div className="z-20">
          <Button content={t("homepage.banner.cta")} />
        </div>
      </div>

      {/* SubBanner */}
      <div className="mx-3 relative z-20">
        <div className="container mt-[-85px] flex flex-wrap bg-black justify-between xl:px-20 xl:py-8">
          {subBannerArr.map((item) => (
            <div
              key={item.titleKey || item.title}
              className="group flex items-center text-white space-x-5 w-full md:w-2/4 xl:w-1/4 p-4 cursor-pointer hover:bg-gray-900/20 rounded-xl transition-all duration-300"
            >
              <div className="logo-container relative w-10 h-10 flex items-center justify-center">
                <div className="text-4xl text-sub relative z-10 transition-all duration-500 group-hover:text-white group-hover:rotate-[360deg] group-hover:-translate-y-2">
                  {item.logo}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full scale-0 transition-transform duration-500 group-hover:scale-100 opacity-20"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold group-hover:scale-110 transition-transform duration-300 origin-left">
                  {t(item.titleKey || item.title)}
                </p>
                <p className="text-xl text-sub group-hover:text-blue-500 transition-colors duration-300">
                  {t(item.subTitleKey || item.subTitle)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Banner;
