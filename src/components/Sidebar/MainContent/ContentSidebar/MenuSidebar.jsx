import React from "react";
import { Link } from "react-router-dom";
import useMenuAndIcon from "~/assets/ContentArrProject/Header/MenuAndIcon";

const MenuSidebar = ({ titleSidebar, setIsOpenSidebar }) => {
  const { boxIconArr, menuArr } = useMenuAndIcon();

  // Get social media icons (first 3 items)
  const socialIcons = boxIconArr.slice(0, 3);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Menu</h3>
      </div>

      <nav className="flex-1">
        <ul className="flex flex-col space-y-3">
          {menuArr.map((item, idx) => (
            <li key={idx}>
              {item.to && (
                <Link
                  to={item.to}
                  onClick={() => setIsOpenSidebar && setIsOpenSidebar(false)}
                  className="text-lg text-gray-800 hover:text-blue-600"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with social media icons */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          {socialIcons.map((item, idx) => (
            <a
              key={idx}
              href={item.to || "#"}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              aria-label={item.title}
            >
              {item.icon}
            </a>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">Follow us</p>
      </div>
    </div>
  );
};

export default MenuSidebar;
