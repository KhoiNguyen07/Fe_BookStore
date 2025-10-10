import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { BsCalendar2CheckFill, BsChatText } from "react-icons/bs";
import freeship from "~/assets/images/homepage/freeship.webp";
import return1 from "~/assets/images/homepage/return.webp";
import security from "~/assets/images/homepage/secu.webp";
import service247 from "~/assets/images/homepage/247.webp";
export const subBannerArr = [
  {
    logo: (
      <img src={freeship} alt="freeship" className="w-10 h-10 object-contain" />
    ),
    titleKey: "homepage.banner1.subBanner.shipping.title",
    subTitleKey: "homepage.banner1.subBanner.shipping.subtitle"
  },
  {
    logo: (
      <img src={security} alt="security" className="w-10 h-10 object-contain" />
    ),
    titleKey: "homepage.banner1.subBanner.payment.title",
    subTitleKey: "homepage.banner1.subBanner.payment.subtitle"
  },
  {
    logo: (
      <img src={return1} alt="return" className="w-10 h-10 object-contain" />
    ),
    titleKey: "homepage.banner1.subBanner.return.title",
    subTitleKey: "homepage.banner1.subBanner.return.subtitle"
  },
  {
    logo: (
      <img
        src={service247}
        alt="service247"
        className="w-10 h-10 object-contain"
      />
    ),
    titleKey: "homepage.banner1.subBanner.support.title",
    subTitleKey: "homepage.banner1.subBanner.support.subtitle"
  }
];
