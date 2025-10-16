import React, { useContext, useEffect } from "react";
import { useLanguage } from "~/contexts/LanguageProvider";
import { Link } from "react-router-dom";
import { StoreContext } from "~/contexts/StoreProvider";

const BoxIcon = ({
  icon,
  to,
  title,
  bgColor = "bg-black",
  textColor = "text-white",
  border = "none",
  setIsOpenSidebar,
  titleSidebar,
  setTitleSidebar,
  setSidebarPosition
}) => {
  const { countItem, countItemFavor } = useContext(StoreContext);
  const { t } = useLanguage();
  return (
    <>
      {to ? (
        <Link
          to={to}
          className={`p-1 text-xs  md:text-lg  rounded-full ${border} ${bgColor} ${textColor}`}
        >
          {icon}
        </Link>
      ) : (
        <button
          onClick={() => {
            // Handle language icon differently - don't open sidebar
            if (title === "language") {
              // Language functionality will be handled by the LanguageSelect component
              // This icon is just for visual consistency
              return;
            }

            // ensure cart and favorite open from the right
            if (title === "cart" || title === "favorite") {
              setSidebarPosition && setSidebarPosition("right");
            }
            setIsOpenSidebar(true);
            // determine stable key for sidebar content to avoid localization breakage
            let key = title;
            if (title === t("nav.cart")) key = "cart";
            if (title === t("nav.favorite")) key = "favorite";
            setTitleSidebar({
              ...titleSidebar,
              icon: icon,
              title: title,
              key
            });
          }}
          className={`p-2 text-xs md:text-lg rounded-full relative ${border} ${bgColor} ${textColor}`}
        >
          {icon}
          {title == "cart" && (
            <div className="absolute text-xs top-0 right-0 px-1 translate-x-1 -translate-y-1 py-0 bg-black text-white rounded-full">
              {countItem}
            </div>
          )}
          {title == "favorite" && (
            <div className="absolute text-xs top-0 right-0 px-1 translate-x-1 -translate-y-1 py-0 bg-black text-white rounded-full">
              {countItemFavor}
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default BoxIcon;
