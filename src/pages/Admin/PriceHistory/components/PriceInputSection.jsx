import React from "react";
import { FaEdit, FaArrowUp, FaTimes, FaSave } from "react-icons/fa";

const PriceInputSection = ({
  selectedInvoiceId,
  editingInvoices,
  editingProduct,
  setEditingProduct,
  getMinimumPrice,
  isPriceValid,
  formatPrice
}) => {
  const selectedInvoice = editingInvoices.find(
    (inv) => inv.id === selectedInvoiceId
  );

  if (!selectedInvoiceId || editingInvoices.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
        <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaEdit className="text-blue-600" />
          Giá bán mới *
        </label>
        <input
          type="number"
          min="0"
          step="1000"
          value={editingProduct?.newSellingPrice ?? ""}
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            setEditingProduct((prev) => ({
              ...prev,
              newSellingPrice: newPrice
            }));
          }}
          className={`w-full px-6 py-4 text-xl border rounded-xl focus:ring-2 transition-all duration-200 ${
            editingProduct?.newSellingPrice && !isPriceValid()
              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
          }`}
          placeholder="Nhập giá bán mới..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Price (Read-only) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaArrowUp className="text-white text-sm" />
            </div>
            <label className="text-sm font-semibold text-gray-800">
              Giá nhập
            </label>
          </div>

          <div className="text-3xl font-bold text-blue-700 mb-2">
            {formatPrice(getMinimumPrice())}
          </div>

          <div className="flex items-center justify-between text-xs text-blue-700">
            <span>Từ hóa đơn: {selectedInvoice?.importInvoiceCode}</span>
            <span className="bg-blue-200 px-2 py-1 rounded">Cố định</span>
          </div>
        </div>

        {/* Selling Price (Editable) */}
        <div
          className={`p-6 rounded-xl border-2 shadow-sm transition-all duration-200 ${
            editingProduct?.newSellingPrice && !isPriceValid()
              ? "bg-gradient-to-br from-red-50 to-pink-100 border-red-200"
              : "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                editingProduct?.newSellingPrice && !isPriceValid()
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              <FaEdit className="text-white text-sm" />
            </div>
            <label className="text-sm font-semibold text-gray-800">
              Giá bán
            </label>
          </div>

          <input
            type="number"
            min="0"
            step="1000"
            value={editingProduct?.newSellingPrice ?? ""}
            onChange={(e) => {
              const newPrice = Number(e.target.value);
              setEditingProduct((prev) => ({
                ...prev,
                newSellingPrice: newPrice
              }));
            }}
            className={`w-full px-4 py-3 text-2xl font-bold border-2 rounded-lg focus:ring-2 transition-all duration-200 ${
              editingProduct?.newSellingPrice && !isPriceValid()
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white text-red-600"
                : "border-green-300 focus:ring-green-500 focus:border-green-500 bg-white text-green-600"
            }`}
            placeholder="0"
          />

          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-600">VND (Việt Nam Đồng)</span>
            {editingProduct?.newSellingPrice && isPriceValid() && (
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                <FaSave className="text-xs" />
                Hợp lệ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {editingProduct?.newSellingPrice && !isPriceValid() && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <FaTimes className="text-red-500 text-lg mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold text-sm">
                Giá bán không hợp lệ!
              </p>
              <p className="text-red-700 text-sm mt-1">
                Giá bán phải lớn hơn hoặc bằng{" "}
                <span className="font-semibold">
                  {formatPrice(getMinimumPrice())}
                </span>
                <br />
                <span className="text-xs">
                  (giá nhập của hóa đơn được chọn)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedInvoiceId && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <FaArrowUp className="text-blue-500 text-lg mt-0.5" />
            <div>
              <p className="text-blue-800 font-semibold text-sm">
                Thông tin tham khảo
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Giá nhập tối thiểu:{" "}
                <span className="font-semibold">
                  {formatPrice(getMinimumPrice())}
                </span>
                <br />
                <span className="text-xs">
                  Từ hóa đơn: {selectedInvoice?.importInvoiceCode}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInputSection;
