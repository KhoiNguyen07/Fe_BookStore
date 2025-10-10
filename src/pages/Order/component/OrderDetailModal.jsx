import React, { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStransferToVND } from "~/hooks/useStransferToVND";

const { formatVND } = useStransferToVND();

const statusMeta = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  shipping: { label: "Shipping", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  cancel: { label: "Cancel", className: "bg-red-100 text-red-700" }
};

export default function OrderDetailModal({ isOpen, onClose, order }) {
  const dialogRef = useRef(null);

  // focus modal khi mở
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  // memo hóa metadata để tránh tính lại nhiều lần
  const sMeta = useMemo(
    () =>
      statusMeta[order?.status] || {
        label: order?.status,
        className: "bg-gray-100 text-gray-700"
      },
    [order?.status]
  );

  // memo hóa danh sách sản phẩm
  const productRows = useMemo(
    () =>
      order?.listProduct?.map((p, idx) => (
        <tr key={idx} className="hover:bg-gray-50 transition">
          <td className="px-4 py-2">{p.name}</td>
          <td className="px-4 py-2 text-center">{p.quantity}</td>
          <td className="px-4 py-2 text-right">{formatVND(p.price)}</td>
          <td className="px-4 py-2 text-right">
            {formatVND(p.price * p.quantity)}
          </td>
        </tr>
      )),
    [order?.listProduct]
  );

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold truncate">
                Order #{order._id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${sMeta.className}`}
              >
                {sMeta.label}
              </span>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>First Name:</strong> {order.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {order.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phoneNumber}
                </p>
                <p className="col-span-2">
                  <strong>Address:</strong> {order.streetAddress}, {order.city},{" "}
                  {order.country}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.isPayment ? "Paid" : "Unpaid"}
                </p>
                <p>
                  <strong>Coupon:</strong> {order.coupon || "--"}
                </p>
                <p>
                  <strong>Note:</strong> {order.note || "--"}
                </p>
              </div>

              {/* Order Info */}
              <div className="text-sm">
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(order.createAt).toLocaleString("en-GB")}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  <span className="text-red-500 font-semibold">
                    {formatVND(order.totalPriceOrder)}
                  </span>
                </p>
              </div>

              {/* Product List */}
              <div>
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Product Name</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">{productRows}</tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
