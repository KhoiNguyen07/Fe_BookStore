import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaShoppingCart,
  FaUser,
  FaTruck,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../../components/Admin/Modal";
import Table from "../../components/Admin/Table";
import SearchBar from "../../components/Admin/SearchBar";
import Pagination from "../../components/Admin/Pagination";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc"
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const orderStatuses = [
    {
      value: "pending",
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-600",
      icon: FaShoppingCart
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-600",
      icon: FaCheck
    },
    {
      value: "preparing",
      label: "Đang chuẩn bị",
      color: "bg-purple-100 text-purple-600",
      icon: FaUser
    },
    {
      value: "shipping",
      label: "Đang giao hàng",
      color: "bg-orange-100 text-orange-600",
      icon: FaTruck
    },
    {
      value: "delivered",
      label: "Đã giao hàng",
      color: "bg-green-100 text-green-600",
      icon: FaCheck
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "bg-red-100 text-red-600",
      icon: FaTimes
    },
    {
      value: "returned",
      label: "Đã trả hàng",
      color: "bg-gray-100 text-gray-600",
      icon: FaTimes
    }
  ];

  const paymentStatuses = [
    {
      value: "pending",
      label: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      value: "paid",
      label: "Đã thanh toán",
      color: "bg-green-100 text-green-600"
    },
    {
      value: "failed",
      label: "Thanh toán thất bại",
      color: "bg-red-100 text-red-600"
    },
    {
      value: "refunded",
      label: "Đã hoàn tiền",
      color: "bg-blue-100 text-blue-600"
    }
  ];

  // Mock data for orders
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        orderCode: "ORD001",
        customerName: "Nguyễn Văn A",
        customerEmail: "nguyenvana@email.com",
        customerPhone: "0123456789",
        totalAmount: 299000,
        shippingFee: 30000,
        discountAmount: 50000,
        finalAmount: 279000,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "COD",
        shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
        note: "Giao hàng giờ hành chính",
        orderDate: "2024-01-20T14:30:00Z",
        confirmedAt: "2024-01-20T15:00:00Z",
        estimatedDelivery: "2024-01-22",
        items: [
          {
            id: 1,
            name: "Harry Potter và Hòn đá Phù thủy",
            quantity: 2,
            price: 150000,
            total: 300000
          },
          {
            id: 2,
            name: "Đắc nhân tâm",
            quantity: 1,
            price: 89000,
            total: 89000
          }
        ]
      },
      {
        id: 2,
        orderCode: "ORD002",
        customerName: "Trần Thị B",
        customerEmail: "tranthib@email.com",
        customerPhone: "0987654321",
        totalAmount: 150000,
        shippingFee: 25000,
        discountAmount: 0,
        finalAmount: 175000,
        status: "shipping",
        paymentStatus: "paid",
        paymentMethod: "VNPay",
        shippingAddress: "456 Đường XYZ, Quận 3, TP.HCM",
        note: "",
        orderDate: "2024-01-19T10:15:00Z",
        confirmedAt: "2024-01-19T11:00:00Z",
        shippedAt: "2024-01-20T09:00:00Z",
        estimatedDelivery: "2024-01-21",
        trackingNumber: "VN123456789",
        items: [
          {
            id: 3,
            name: "Doraemon - Tập 1",
            quantity: 6,
            price: 25000,
            total: 150000
          }
        ]
      },
      {
        id: 3,
        orderCode: "ORD003",
        customerName: "Lê Văn C",
        customerEmail: "levanc@email.com",
        customerPhone: "0123987654",
        totalAmount: 200000,
        shippingFee: 30000,
        discountAmount: 20000,
        finalAmount: 210000,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "COD",
        shippingAddress: "789 Đường DEF, Quận 7, TP.HCM",
        note: "Kiểm tra hàng trước khi thanh toán",
        orderDate: "2024-01-21T16:45:00Z",
        estimatedDelivery: "2024-01-24",
        items: [
          {
            id: 1,
            name: "Harry Potter và Hòn đá Phù thủy",
            quantity: 1,
            price: 150000,
            total: 150000
          },
          {
            id: 4,
            name: "Sách Kỹ năng sống",
            quantity: 1,
            price: 50000,
            total: 50000
          }
        ]
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = orders.filter((order) => {
      const matchesSearch =
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const matchesPaymentStatus =
        !filterPaymentStatus || order.paymentStatus === filterPaymentStatus;

      const orderDate = new Date(order.orderDate);
      const matchesDateRange =
        (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
        (!dateRange.end || orderDate <= new Date(dateRange.end));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesDateRange
      );
    });

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "orderDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [
    orders,
    searchTerm,
    sortConfig,
    filterStatus,
    filterPaymentStatus,
    dateRange
  ]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };

          // Auto-update timestamps based on status
          const now = new Date().toISOString();
          if (newStatus === "confirmed" && !order.confirmedAt) {
            updatedOrder.confirmedAt = now;
          } else if (newStatus === "shipping" && !order.shippedAt) {
            updatedOrder.shippedAt = now;
            updatedOrder.trackingNumber = `VN${Date.now()}`;
          } else if (newStatus === "delivered" && !order.deliveredAt) {
            updatedOrder.deliveredAt = now;
          }

          return updatedOrder;
        }
        return order;
      })
    );

    toast.success("Cập nhật trạng thái đơn hàng thành công!");
  };

  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus: newPaymentStatus }
          : order
      )
    );

    toast.success("Cập nhật trạng thái thanh toán thành công!");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusConfig = (status) => {
    return orderStatuses.find((s) => s.value === status) || orderStatuses[0];
  };

  const getPaymentStatusConfig = (status) => {
    return (
      paymentStatuses.find((s) => s.value === status) || paymentStatuses[0]
    );
  };

  const columns = [
    { key: "orderCode", label: "Mã đơn hàng", sortable: true },
    { key: "customerName", label: "Khách hàng", sortable: true },
    {
      key: "orderDate",
      label: "Ngày đặt",
      sortable: true,
      render: (order) => formatDate(order.orderDate)
    },
    {
      key: "finalAmount",
      label: "Tổng tiền",
      sortable: true,
      render: (order) => (
        <span className="font-medium text-green-600">
          {order.finalAmount.toLocaleString()}đ
        </span>
      )
    },
    {
      key: "status",
      label: "Trạng thái",
      sortable: true,
      render: (order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${statusConfig.color}`}
          >
            <StatusIcon className="text-xs" />
            {statusConfig.label}
          </span>
        );
      }
    },
    {
      key: "paymentStatus",
      label: "Thanh toán",
      sortable: true,
      render: (order) => {
        const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${paymentConfig.color}`}
          >
            {paymentConfig.label}
          </span>
        );
      }
    },
    { key: "paymentMethod", label: "Phương thức", sortable: true },
    {
      key: "actions",
      label: "Thao tác",
      render: (order) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="text-blue-600 hover:text-blue-800"
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <select
            value={order.status}
            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
            title="Cập nhật trạng thái"
          >
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      )
    }
  ];

  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <span className="text-gray-600">
            Tổng: {filteredOrders.length} đơn hàng
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, email, SĐT..."
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Tất cả trạng thái</option>
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Tất cả thanh toán</option>
              {paymentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Từ ngày</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Đến ngày</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setViewingOrder(null);
        }}
        title={`Chi tiết đơn hàng ${viewingOrder?.orderCode}`}
        size="xl"
      >
        {viewingOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Mã đơn hàng:</span>{" "}
                    {viewingOrder.orderCode}
                  </p>
                  <p>
                    <span className="font-medium">Ngày đặt:</span>{" "}
                    {formatDate(viewingOrder.orderDate)}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>
                    <select
                      value={viewingOrder.status}
                      onChange={(e) => {
                        handleUpdateOrderStatus(
                          viewingOrder.id,
                          e.target.value
                        );
                        setViewingOrder((prev) => ({
                          ...prev,
                          status: e.target.value
                        }));
                      }}
                      className="ml-2 border border-gray-300 rounded px-2 py-1"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p>
                    <span className="font-medium">Thanh toán:</span>
                    <select
                      value={viewingOrder.paymentStatus}
                      onChange={(e) => {
                        handleUpdatePaymentStatus(
                          viewingOrder.id,
                          e.target.value
                        );
                        setViewingOrder((prev) => ({
                          ...prev,
                          paymentStatus: e.target.value
                        }));
                      }}
                      className="ml-2 border border-gray-300 rounded px-2 py-1"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p>
                    <span className="font-medium">Phương thức TT:</span>{" "}
                    {viewingOrder.paymentMethod}
                  </p>
                  {viewingOrder.trackingNumber && (
                    <p>
                      <span className="font-medium">Mã vận đơn:</span>{" "}
                      {viewingOrder.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Tên:</span>{" "}
                    {viewingOrder.customerName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {viewingOrder.customerEmail}
                  </p>
                  <p>
                    <span className="font-medium">SĐT:</span>{" "}
                    {viewingOrder.customerPhone}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {viewingOrder.shippingAddress}
                  </p>
                  {viewingOrder.note && (
                    <p>
                      <span className="font-medium">Ghi chú:</span>{" "}
                      {viewingOrder.note}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Sản phẩm đặt hàng
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Sản phẩm</th>
                      <th className="px-4 py-2 text-center">Số lượng</th>
                      <th className="px-4 py-2 text-right">Đơn giá</th>
                      <th className="px-4 py-2 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.price.toLocaleString()}đ
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.total.toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Tổng kết đơn hàng
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng:</span>
                  <span>{viewingOrder.totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{viewingOrder.shippingFee.toLocaleString()}đ</span>
                </div>
                {viewingOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Giảm giá:</span>
                    <span>
                      -{viewingOrder.discountAmount.toLocaleString()}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Tổng thanh toán:</span>
                  <span className="text-green-600">
                    {viewingOrder.finalAmount.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setViewingOrder(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
