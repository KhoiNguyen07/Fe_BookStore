import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaBoxes,
  FaShoppingCart,
  FaTags,
  FaFileInvoice,
  FaWarehouse,
  FaComments,
  FaExchangeAlt,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUserShield,
  FaIdCard,
  FaUserFriends,
  FaTruck,
  FaPercent,
  FaLayerGroup,
  FaStar,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
  FaHistory
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: FaTachometerAlt,
      path: "/admin",
      exact: true
    },
    {
      key: "accounts",
      title: "Quản lý tài khoản",
      icon: FaUserShield,
      children: [
        { title: "Roles", path: "/admin/roles", icon: FaIdCard },
        { title: "Accounts", path: "/admin/accounts", icon: FaUsers }
      ]
    },
    {
      key: "customers",
      title: "Quản lý khách hàng",
      icon: FaUserFriends,
      children: [
        {
          title: "Customer Types",
          path: "/admin/customer-types",
          icon: FaTags
        },
        { title: "Customers", path: "/admin/customers", icon: FaUsers }
      ]
    },
    {
      key: "employees",
      title: "Nhân viên",
      icon: FaUserTie,
      path: "/admin/employees"
    },
    {
      key: "suppliers",
      title: "Nhà cung cấp",
      icon: FaTruck,
      path: "/admin/suppliers"
    },
    {
      key: "products",
      title: "Quản lý sản phẩm",
      icon: FaBoxes,
      children: [
        {
          title: "Categories",
          path: "/admin/product-categories",
          icon: FaLayerGroup
        },
        { title: "Products", path: "/admin/products", icon: FaBoxes }
      ]
    },
    {
      key: "promotions",
      title: "Khuyến mãi",
      icon: FaPercent,
      children: [
        {
          title: "Promotion Types",
          path: "/admin/promotion-types",
          icon: FaTags
        },
        { title: "Promotions", path: "/admin/promotions", icon: FaPercent }
      ]
    },
    {
      key: "orders",
      title: "Đơn hàng",
      icon: FaShoppingCart,
      children: [
        { title: "Orders", path: "/admin/orders", icon: FaShoppingCart },
        {
          title: "Promotion Orders",
          path: "/admin/promotion-orders",
          icon: FaTags
        }
      ]
    },
    {
      key: "imports",
      title: "Nhập hàng",
      icon: FaFileInvoice,
      children: [
        {
          title: "Import Invoices",
          path: "/admin/import-invoices",
          icon: FaFileInvoice
        },
        {
          title: "Import Details",
          path: "/admin/import-details",
          icon: FaClipboardList
        }
      ]
    },
    {
      key: "inventory",
      title: "Kho hàng",
      icon: FaWarehouse,
      children: [
        { title: "Inventory", path: "/admin/inventory", icon: FaWarehouse },
        {
          title: "Price History",
          path: "/admin/price-history",
          icon: FaHistory
        }
      ]
    },
    {
      key: "others",
      title: "Khác",
      icon: FaStar,
      children: [
        { title: "Comments", path: "/admin/comments", icon: FaComments },
        { title: "Carts", path: "/admin/carts", icon: FaShoppingBag },
        { title: "Favorites", path: "/admin/favorites", icon: FaStar },
        {
          title: "Returns/Exchanges",
          path: "/admin/returns",
          icon: FaExchangeAlt
        }
      ]
    }
  ];

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } flex-shrink-0`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1
              className={`font-bold text-xl ${
                sidebarOpen ? "block" : "hidden"
              }`}
            >
              BookStore Admin
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <div key={item.key}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                      sidebarOpen ? "" : "justify-center"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="text-lg" />
                      {sidebarOpen && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </div>
                    {sidebarOpen &&
                      (expandedMenus[item.key] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      ))}
                  </button>
                  {expandedMenus[item.key] && sidebarOpen && (
                    <div className="bg-gray-800">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center px-8 py-2 text-sm hover:bg-gray-700 transition-colors ${
                            isActiveLink(child.path) ? "bg-blue-600" : ""
                          }`}
                        >
                          <child.icon className="text-sm mr-3" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${
                    isActiveLink(item.path, item.exact) ? "bg-blue-600" : ""
                  } ${sidebarOpen ? "" : "justify-center"}`}
                >
                  <item.icon className="text-lg" />
                  {sidebarOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                {location.pathname === "/admin"
                  ? "Dashboard"
                  : location.pathname
                      .split("/")
                      .pop()
                      .replace("-", " ")
                      .toUpperCase()}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
