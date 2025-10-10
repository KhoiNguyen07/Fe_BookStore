import pic1 from "~/assets/images/SaleHomepagePic1.jpeg";
import pic2 from "~/assets/images/SaleHomepagePic2.jpeg";
import Button from "~/components/Button/Button";

import { useTranslateXImage } from "~/hooks/useTranslateXImage";

const SaleHomePage = () => {
  const translateX = useTranslateXImage();
  return (
    <div className="flex flex-wrap justify-between">
      <div className="w-full xl:w-2/5 flex justify-center xl:justify-start px-5 overflow-hidden">
        <img
          className="w-[500px] h-[500px] transition-transform duration-[50ms] ease-out"
          style={{ transform: `translateX(${translateX}px)` }}
          src={pic1}
          alt=""
        />
      </div>

      <div className="w-full xl:w-1/5 mt-20 px-5 flex flex-col justify-center items-center text-center space-y-5">
        <h2 className="text-5xl">Sale of the year</h2>
        <p className="text-xl text-third">
          Libero sed faucibus facilisis fermentum. Est nibh sed massa sodales.
          Read more
        </p>
        <Button
          content={"Read more"}
          hoverTextColor={"hover:text-white"}
          bgColor={"bg-transparent"}
          hoverBgColor={"hover:bg-black"}
          textColor={"text-black"}
        />
      </div>
      <div className="hidden xl:w-2/5 xl:flex justify-end px-5">
        <img
          className="w-[500px] h-[500px] transition-transform duration-[50ms] ease-out"
          style={{ transform: `translateX(-${translateX}px)` }}
          src={pic2}
          alt=""
        />
      </div>
    </div>
  );
};

export default SaleHomePage;
