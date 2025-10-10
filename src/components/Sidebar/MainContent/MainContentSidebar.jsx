import React, { useContext } from "react";
import SignInSidebar from "./ContentSidebar/SignInSidebar";
import CompareSidebar from "./ContentSidebar/CompareSidebar";
import WishlistSidebar from "./ContentSidebar/WishlistSidebar";
import CartSidebar from "./ContentSidebar/CartSidebar";
import SeeProduct from "./ContentSidebar/SeeProduct";
import MenuSidebar from "./ContentSidebar/MenuSidebar";
import { SidebarContext } from "~/contexts/SidebarProvider";

const MainContentSidebar = ({ titleSidebar, setIsOpenSidebar }) => {
  let contentInSidebar = null;
  const { currentItemToSee } = useContext(SidebarContext);

  switch (titleSidebar.title) {
    case "Sign in":
      contentInSidebar = (
        <SignInSidebar
          titleSidebar={titleSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      );
      break;

    case "compare":
      contentInSidebar = <CompareSidebar titleSidebar={titleSidebar} />;
      break;
    case "favorite":
      contentInSidebar = <WishlistSidebar titleSidebar={titleSidebar} />;
      break;
    case "cart":
      contentInSidebar = <CartSidebar titleSidebar={titleSidebar} />;
      break;
    case "see":
      contentInSidebar = <SeeProduct product={currentItemToSee} />;
      break;
    case "menu":
      contentInSidebar = (
        <MenuSidebar
          titleSidebar={titleSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      );
      break;
    default:
      contentInSidebar = null;
      break;
  }

  return <>{contentInSidebar}</>;
};

export default MainContentSidebar;
