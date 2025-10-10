import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropdownCustom from "~/components/Dropdown/DropdownCustom";
import { StoreContext } from "~/contexts/StoreProvider";
import { showConfirmToast } from "~/utils/showConfirmToast";
import { CiUser } from "react-icons/ci";
import { useLanguage } from "~/contexts/LanguageProvider";

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

  console.log(t("nav.signin"));

  return (
    <>
      {to ? (
        <Link to={to} className="hidden xl:block menu">
          {title}
        </Link>
      ) : userInfo ? (
        title == t("nav.search") ? (
          <button
            className="hidden xl:block menu"
            onClick={() => {
              setIsOpenSearchFunction(true);
            }}
          >
            {title}
          </button>
        ) : (
          <DropdownCustom items={itemPageAfterUserLogin}>
            <button type="button" className="menu flex items-center gap-2">
              {/* Desktop: hiện tên + icon */}
              <span className="hidden xl:flex items-center gap-1">
                {userInfo.username}
              </span>
            </button>
          </DropdownCustom>
        )
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsOpenSidebar(title === t("nav.signin"));
            setTitleSidebar({ ...titleSidebar, icon: "", title: title });
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
