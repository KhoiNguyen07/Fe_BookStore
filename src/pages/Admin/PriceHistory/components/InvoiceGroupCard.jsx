import React from "react";
import { FaFileInvoice, FaCalendarAlt, FaShoppingCart } from "react-icons/fa";

const InvoiceGroupCard = ({
  title,
  invoices,
  selectedInvoiceId,
  onInvoiceSelect,
  formatPrice,
  formatDate,
  bgColor = "bg-white",
  borderColor = "border-gray-200",
  badgeColor = "bg-gray-100 text-gray-700",
  selectionColor = "bg-blue-50 border-l-blue-500"
}) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <FaFileInvoice className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Không có hóa đơn nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaFileInvoice className="text-blue-600" />
          {title}
        </h5>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {invoices.length} hóa đơn
        </span>
      </div>

      <div
        className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden max-h-80 overflow-y-auto shadow-sm`}
      >
        <div className="divide-y divide-gray-100">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`p-4 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                selectedInvoiceId === invoice.id
                  ? `${selectionColor} border-l-4`
                  : ""
              }`}
              onClick={() => onInvoiceSelect(invoice.id)}
            >
              <div className="flex items-start justify-between">
                {/* Invoice Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                      selectedInvoiceId === invoice.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedInvoiceId === invoice.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 min-w-0">
                      <span
                        className="font-semibold text-gray-900 text-sm max-w-[220px] truncate"
                        title={invoice.importInvoiceCode}
                      >
                        {invoice.importInvoiceCode}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor} flex-shrink-0 whitespace-nowrap`}
                      >
                        {title.includes("đã có") ? "Có giá bán" : "Chưa có giá"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(invoice.importDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaShoppingCart className="text-gray-400" />
                        SL: {invoice.remaining}
                      </div>
                    </div>

                    {invoice.supplierCode && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                        NCC: {invoice.supplierCode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Info */}
                <div className="text-right space-y-1">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Giá nhập</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(invoice.importPrice)}
                    </p>
                  </div>

                  {invoice.unitPrice != null ||
                  invoice.priceHistoryData?.unitPrice != null ? (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Giá bán</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatPrice(
                          invoice.unitPrice ||
                            invoice.priceHistoryData?.unitPrice
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded text-center">
                      Nhấn để tạo giá
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGroupCard;
