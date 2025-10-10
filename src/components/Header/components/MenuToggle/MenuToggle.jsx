import { CgMenu } from "react-icons/cg";
import { useContext } from "react";
import { SidebarContext } from "~/contexts/SidebarProvider";

const MenuToggle = () => {
  const { setIsOpenSidebar, setSidebarPosition, setTitleSidebar } =
    useContext(SidebarContext);
  return (
    <button
      aria-label="Open menu"
      onClick={() => {
        setSidebarPosition && setSidebarPosition("left");
        setTitleSidebar({ title: "menu", icon: null });
        setIsOpenSidebar(true);
      }}
      className="block text-xl xl:hidden absolute left-0 top-1/2 -translate-y-1/2 px-5"
    >
      <CgMenu />
    </button>
  );
};

export default MenuToggle;
