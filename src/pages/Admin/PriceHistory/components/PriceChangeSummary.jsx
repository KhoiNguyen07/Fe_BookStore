import React from "react";
import { FaChartLine, FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";

const PriceChangeSummary = ({
  editingProduct,
  getLatestImportPrice,
  calculateProfitMargin,
  formatPrice
}) => {
  if (
    !editingProduct?.newSellingPrice ||
    editingProduct?.newSellingPrice === editingProduct?.currentSellingPrice
  ) {
    return null;
  }

  const priceChange =
    (editingProduct?.newSellingPrice || 0) -
    (editingProduct?.currentSellingPrice || 0);
  const isIncrease = priceChange > 0;
  const newProfit =
    (editingProduct?.newSellingPrice || 0) -
    getLatestImportPrice(editingProduct);
  const newProfitMargin = calculateProfitMargin(
    editingProduct?.newSellingPrice || 0,
    getLatestImportPrice(editingProduct)
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <FaChartLine className="text-white text-lg" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">
          Tóm tắt thay đổi giá
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Comparison */}
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            So sánh giá bán
          </h5>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Giá bán hiện tại:</span>
              <span className="text-xl font-bold text-gray-800">
                {formatPrice(editingProduct.currentSellingPrice)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Giá bán mới:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(editingProduct?.newSellingPrice)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isIncrease ? (
                    <FaArrowUp className="text-green-500" />
                  ) : (
                    <FaArrowDown className="text-red-500" />
                  )}
                  <span className="text-gray-600 text-sm">Thay đổi:</span>
                </div>
                <span
                  className={`text-xl font-bold flex items-center gap-1 ${
                    isIncrease ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isIncrease ? "+" : ""}
                  {formatPrice(priceChange)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Phân tích lợi nhuận
          </h5>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Giá nhập:</span>
              <span className="text-lg font-semibold text-blue-600">
                {formatPrice(getLatestImportPrice(editingProduct))}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Lợi nhuận mới:</span>
              <span
                className={`text-xl font-bold ${
                  newProfit > 0
                    ? "text-green-600"
                    : newProfit < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {formatPrice(newProfit)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  Tỷ suất lợi nhuận:
                </span>
                <div className="flex items-center gap-2">
                  {newProfitMargin > 0 ? (
                    <FaArrowUp className="text-green-500 text-sm" />
                  ) : newProfitMargin < 0 ? (
                    <FaArrowDown className="text-red-500 text-sm" />
                  ) : (
                    <FaEquals className="text-gray-500 text-sm" />
                  )}
                  <span
                    className={`text-lg font-bold ${
                      newProfitMargin > 0
                        ? "text-green-600"
                        : newProfitMargin < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {newProfitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Badge */}
      <div className="mt-4 text-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isIncrease && newProfit > 0
              ? "bg-green-100 text-green-800"
              : !isIncrease && newProfit >= 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isIncrease && newProfit > 0 && "✓ Tăng giá có lợi nhuận"}
          {!isIncrease && newProfit >= 0 && "⚠ Giảm giá nhưng vẫn có lãi"}
          {newProfit < 0 && "⚠ Cảnh báo: Giá bán thấp hơn giá nhập"}
        </div>
      </div>
    </div>
  );
};

export default PriceChangeSummary;
