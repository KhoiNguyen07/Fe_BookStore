import { IoIosClose } from "react-icons/io";
import "./style.scss";
import { useAnimationSidebar } from "~/hooks/useAnimationSidebar";
import MainContentSidebar from "./MainContent/MainContentSidebar";

const Sidebar = ({
  isOpenSidebar,
  setIsOpenSidebar,
  titleSidebar,
  position = "right"
}) => {
  // animation sidebar
  const { shouldRender, animationClass } = useAnimationSidebar(
    isOpenSidebar,
    position
  );

  return (
    <>
      {/* Overlay */}
      {shouldRender && (
        <div
          onClick={() => setIsOpenSidebar(false)}
          className={`sidebar-overlay fixed inset-0 bg-black/50 z-50 ${
            isOpenSidebar ? "active" : ""
          }`}
        ></div>
      )}

      {/* Sidebar */}
      {shouldRender && (
        <div
          className={`${animationClass} fixed top-0 ${
            position === "left" ? "left-0" : "right-0"
          } h-screen w-[280px] md:w-[350px] z-50 flex flex-col bg-white`}
          style={{ zIndex: 60 }}
        >
          {/* toggle close */}
          <button
            onClick={() => setIsOpenSidebar(false)}
            className={`text-3xl top-5 p-2 bg-white rounded-full absolute cursor-pointer hover:bg-gray-200 transition-colors duration-300 ${
              position === "left" ? "-right-16" : "-left-16"
            }`}
          >
            <IoIosClose />
          </button>

          {/* content in sidebar */}
          <MainContentSidebar
            titleSidebar={titleSidebar}
            setIsOpenSidebar={setIsOpenSidebar}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
