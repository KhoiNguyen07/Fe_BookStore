import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropdownCustom from "~/components/Dropdown/DropdownCustom";
import { StoreContext } from "~/contexts/StoreProvider";
import { showConfirmToast } from "~/utils/showConfirmToast";
import { CiUser } from "react-icons/ci";
import { useLanguage } from "~/contexts/LanguageProvider";
import { SearchContext } from "~/contexts/SearchProvider";

const Menu = ({
  title,
  to,
  setIsOpenSidebar,
  titleSidebar,
  setTitleSidebar,
  setIsOpenSearchFunction
}) => {
  const { t } = useLanguage();
  const { userInfo, setUserInfo, setCountItem } = useContext(StoreContext);
  const { setIsOpenSearchFunction: contextSetIsOpenSearch } =
    useContext(SearchContext);
  const navigate = useNavigate();
  const confirmLogout = () => {
    showConfirmToast({
      message: "Are you sure logout your account?",
      onConfirm: () => {
        setUserInfo(null);
        setCountItem(0);
      }
    });
  };

  const itemPageAfterUserLogin = [
    {
      key: "1",
      label: <button onClick={confirmLogout}>Logout</button>
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => {
            navigate("/order");
          }}
        >
          Your orders
        </button>
      )
    }
  ];

  return (
    <>
      {to ? (
        <Link to={to} className="hidden xl:block menu">
          {title}
        </Link>
      ) : title === t("nav.search") ? (
        // Search button should be available regardless of login state and language
        <button
          className="hidden xl:block menu"
          onClick={() => {
            // prefer prop setter, fall back to context setter
            if (typeof setIsOpenSearchFunction === "function") {
              setIsOpenSearchFunction(true);
            } else if (typeof contextSetIsOpenSearch === "function") {
              contextSetIsOpenSearch(true);
            }
          }}
        >
          {title}
        </button>
      ) : userInfo ? (
        <DropdownCustom items={itemPageAfterUserLogin}>
          <button type="button" className="menu flex items-center gap-2">
            {/* Desktop: hiện tên + icon */}
            <span className="hidden xl:flex items-center gap-1">
              {userInfo.username}
            </span>
          </button>
        </DropdownCustom>
      ) : (
        <button
          type="button"
          onClick={() => {
            const shouldOpen = title === t("nav.signin");
            setIsOpenSidebar(shouldOpen);
            // set a stable key for the sidebar to avoid localization issues
            const key = shouldOpen
              ? "signin"
              : (titleSidebar && titleSidebar.key) || "";
            setTitleSidebar({ ...titleSidebar, icon: "", title: title, key });
          }}
          className="hidden xl:block menu"
        >
          {title}
        </button>
      )}
    </>
  );
};

export default Menu;
