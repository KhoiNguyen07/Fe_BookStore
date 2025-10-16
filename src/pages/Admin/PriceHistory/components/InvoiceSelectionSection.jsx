import React from "react";
import InvoiceGroupCard from "./InvoiceGroupCard";
import { FaFileInvoice, FaBalanceScale } from "react-icons/fa";

const InvoiceSelectionSection = ({
  editingInvoices,
  selectedInvoiceId,
  handleInvoiceToggle,
  formatPrice,
  formatDate
}) => {
  if (editingInvoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFileInvoice className="text-gray-300 text-6xl mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          Không có hóa đơn nhập nào
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Sản phẩm này chưa có dữ liệu nhập hàng
        </p>
      </div>
    );
  }

  const invoicesWithPrice = editingInvoices.filter(
    (inv) => inv.unitPrice != null || inv.priceHistoryData?.priceHistoryCode
  );
  const invoicesWithoutPrice = editingInvoices.filter(
    (inv) => !(inv.unitPrice != null || inv.priceHistoryData?.priceHistoryCode)
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaBalanceScale className="text-white text-xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Chọn hóa đơn nhập để áp dụng giá
              </h4>
              <p className="text-blue-700 text-sm mt-1">
                Tổng cộng {editingInvoices.length} hóa đơn nhập có sẵn
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">
                {invoicesWithPrice.length}
              </span>{" "}
              có giá bán
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-amber-600">
                {invoicesWithoutPrice.length}
              </span>{" "}
              chưa có giá
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices with existing selling price */}
        <div className="space-y-4">
          <InvoiceGroupCard
            title="Hóa đơn đã có giá bán"
            invoices={invoicesWithPrice}
            selectedInvoiceId={selectedInvoiceId}
            onInvoiceSelect={handleInvoiceToggle}
            formatPrice={formatPrice}
            formatDate={formatDate}
            bgColor="bg-gradient-to-br from-white to-indigo-50"
            borderColor="border-indigo-200"
            badgeColor="bg-indigo-100 text-indigo-700"
            selectionColor="bg-indigo-50 border-l-indigo-500"
          />
        </div>

        {/* Invoices without selling price */}
        <div className="space-y-4">
          <InvoiceGroupCard
            title="Hóa đơn chưa có giá bán"
            invoices={invoicesWithoutPrice}
            selectedInvoiceId={selectedInvoiceId}
            onInvoiceSelect={handleInvoiceToggle}
            formatPrice={formatPrice}
            formatDate={formatDate}
            bgColor="bg-gradient-to-br from-white to-amber-50"
            borderColor="border-amber-200"
            badgeColor="bg-amber-100 text-amber-700"
            selectionColor="bg-amber-50 border-l-amber-500"
          />
        </div>
      </div>

      {/* Selection Status */}
      {selectedInvoiceId && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-green-800 font-semibold">
                Đã chọn hóa đơn:{" "}
                <span
                  className="text-black"
                  title={
                    editingInvoices.find((inv) => inv.id === selectedInvoiceId)
                      ?.importInvoiceCode
                  }
                >
                  {
                    editingInvoices.find((inv) => inv.id === selectedInvoiceId)
                      ?.importInvoiceCode
                  }
                </span>
              </p>
              <p className="text-green-700 text-sm">
                Giá nhập áp dụng:{" "}
                {formatPrice(
                  editingInvoices.find((inv) => inv.id === selectedInvoiceId)
                    ?.importPrice || 0
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSelectionSection;
