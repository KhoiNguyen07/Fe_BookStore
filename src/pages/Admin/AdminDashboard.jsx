import React from "react";
import AdminLayout from "~/components/Admin/AdminLayout";
import {
  FaUsers,
  FaBoxes,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FaShoppingCart,
      color: "bg-blue-500"
    },
    {
      title: "Total Customers",
      value: "2,567",
      change: "+8%",
      changeType: "positive",
      icon: FaUsers,
      color: "bg-green-500"
    },
    {
      title: "Total Products",
      value: "456",
      change: "+3%",
      changeType: "positive",
      icon: FaBoxes,
      color: "bg-purple-500"
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "-2%",
      changeType: "negative",
      icon: FaDollarSign,
      color: "bg-yellow-500"
    }
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      amount: "$150.00",
      status: "Completed",
      date: "2024-01-15"
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      amount: "$89.99",
      status: "Processing",
      date: "2024-01-15"
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      amount: "$299.99",
      status: "Shipped",
      date: "2024-01-14"
    },
    {
      id: "#12348",
      customer: "Sarah Wilson",
      amount: "$45.50",
      status: "Pending",
      date: "2024-01-14"
    },
    {
      id: "#12349",
      customer: "Tom Brown",
      amount: "$199.99",
      status: "Completed",
      date: "2024-01-13"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-blue-100">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "positive" ? (
                      <FaArrowUp className="text-green-500 text-xs mr-1" />
                    ) : (
                      <FaArrowDown className="text-red-500 text-xs mr-1" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}
                >
                  <stat.icon className="text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <FaChartLine className="text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="text-4xl text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">Chart will be implemented here</p>
                <p className="text-sm text-gray-400">
                  Integration with Chart.js or similar
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Orders
            </h3>
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Orders →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Add New Product
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                Create Promotion
              </button>
              <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Low Stock Alert
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm text-red-800">Product A</span>
                <span className="text-xs text-red-600">5 left</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <span className="text-sm text-orange-800">Product B</span>
                <span className="text-xs text-orange-600">12 left</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-800">Product C</span>
                <span className="text-xs text-yellow-600">18 left</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
