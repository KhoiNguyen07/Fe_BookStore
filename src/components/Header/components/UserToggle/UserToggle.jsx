import React, { useContext } from "react";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "~/contexts/StoreProvider";
import { SidebarContext } from "~/contexts/SidebarProvider";
import DropdownCustom from "~/components/Dropdown/DropdownCustom";
import { showConfirmToast } from "~/utils/showConfirmToast";

const UserToggle = () => {
  const { userInfo, setUserInfo, setCountItem } = useContext(StoreContext);
  const { setIsOpenSidebar, setTitleSidebar, setSidebarPosition } =
    useContext(SidebarContext);
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

  const handleSignInClick = () => {
    setSidebarPosition("right");
    setIsOpenSidebar(true);
    setTitleSidebar({ icon: "", title: "Sign in", key: "signin" });
  };

  return (
    <div className="block text-xl xl:hidden absolute right-9 top-5 -translate-y-1/2 px-3">
      {userInfo ? (
        <DropdownCustom items={itemPageAfterUserLogin}>
          <button type="button" className="flex items-center gap-2">
            <CiUser />
          </button>
        </DropdownCustom>
      ) : (
        <button type="button" onClick={handleSignInClick}>
          <CiUser />
        </button>
      )}
    </div>
  );
};

export default UserToggle;
