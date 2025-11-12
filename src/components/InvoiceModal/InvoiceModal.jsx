import React, { forwardRef } from "react";
import {
  FaPrint,
  FaStore,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaCreditCard
} from "react-icons/fa";

const InvoiceModal = forwardRef(({ order, onClose }, ref) => {
  if (!order) return null;

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value)))
      return "0";
    try {
      return Number(value).toLocaleString("vi-VN");
    } catch (e) {
      return String(value);
    }
  };

  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Hóa đơn bán hàng</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPrint />
              In hóa đơn
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={ref} className="p-6 print:p-0">
          {/* Store Header */}
          <div className="text-center mb-6 pb-4 border-b print:border-black">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaStore className="text-blue-600 text-2xl" />
              <h1 className="text-2xl font-bold text-blue-600">BookStore</h1>
            </div>
            <div className="text-gray-600 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <FaMapMarkerAlt className="text-sm" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FaPhone className="text-sm" />
                <span>Hotline: 0123-456-789</span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Mã đơn:</strong>{" "}
                  {order.orderCode || order.id || "N/A"}
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendar />
                  <strong>Ngày bán:</strong>{" "}
                  {formatDateTime(order.orderDate || new Date())}
                </div>
                <div className="flex items-center gap-1">
                  <FaCreditCard />
                  <strong>Thanh toán:</strong>{" "}
                  {order.paymentMethod === "cash" ? "Tiền mặt" : "Thẻ"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Tên:</strong> {order.customerName || "Khách lẻ"}
                </div>
                {order.customerPhone && (
                  <div>
                    <strong>Điện thoại:</strong> {order.customerPhone}
                  </div>
                )}
                {order.customerEmail && (
                  <div>
                    <strong>Email:</strong> {order.customerEmail}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Chi tiết đơn hàng</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    STT
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Sản phẩm
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    SL
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Đơn giá
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-gray-500">
                          {item.productCode}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {formatCurrency(item.unitPrice)}đ
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                      {formatCurrency(item.unitPrice * item.quantity)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.subtotal)}đ</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(order.discount)}đ</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.total)}đ</span>
              </div>

              {order.paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between">
                    <span>Tiền nhận:</span>
                    <span>{formatCurrency(order.receivedAmount)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền thừa:</span>
                    <span>{formatCurrency(order.change)}đ</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center">
            <div className="text-sm text-gray-600 mb-2">
              Cảm ơn quý khách! Hẹn gặp lại!
            </div>
            <div className="text-xs text-gray-500">
              Hóa đơn được in lúc: {formatDateTime(new Date())}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .fixed {
            position: relative;
          }
          .bg-black {
            background: transparent;
          }
          .rounded-lg {
            border-radius: 0;
          }
          .max-w-2xl {
            max-width: 100%;
          }
          .mx-4 {
            margin: 0;
          }
          .max-h-screen {
            max-height: none;
          }
          .overflow-auto {
            overflow: visible;
          }
          .p-4.border-b {
            display: none;
          }
        }
      `}</style>
    </div>
  );
});

InvoiceModal.displayName = "InvoiceModal";

export default InvoiceModal;
