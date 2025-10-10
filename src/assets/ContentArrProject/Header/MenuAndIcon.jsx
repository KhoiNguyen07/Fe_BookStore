import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaRegHeart
} from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { Globe } from "lucide-react";
import LanguageSelect from "~/components/Header/components/LanguageSelect/LanguageSelect";
import { useLanguage } from "~/contexts/LanguageProvider";

const useMenuAndIcon = () => {
  const { t } = useLanguage();

  const boxIconArr = [
    {
      title: "facebook",
      icon: <FaFacebookF />,
      to: ""
    },
    {
      title: "instagram",
      icon: <FaInstagram />,
      to: ""
    },
    {
      title: "youtube",
      icon: <FaYoutube />,
      to: ""
    },
    {
      title: "language",
      icon: <LanguageSelect />,
      to: ""
    },
    {
      title: t("nav.favorite"),
      icon: <FaRegHeart color="white" />,
      to: ""
    },
    {
      title: t("nav.cart"),
      icon: <BsCart3 color="white" />,
      to: ""
    }
  ];

  const menuArr = [
    {
      title: t("nav.home"),
      to: "/"
    },
    {
      title: t("nav.shop"),
      to: "/shop"
    },
    {
      title: t("nav.about"),
      to: "/about"
    },
    {
      title: t("nav.contact"),
      to: "contacts"
    },
    {
      title: t("nav.search"),
      to: ""
    },
    {
      title: t("nav.signin"),
      to: ""
    }
  ];

  return { boxIconArr, menuArr };
};

export default useMenuAndIcon;
