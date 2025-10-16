import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { importInvoiceService } from "~/apis/importInvoiceService";
import { supplierService } from "~/apis/supplierService";

// Thông tin cửa hàng - có thể chỉnh sửa dễ dàng
const STORE_INFO = {
  name: "CỬA HÀNG SÁCH BookVerse",
  address: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
  phone: "(028) 3823 4567",
  email: "info@sachgiaoduc.com.vn",
  taxCode: "0123456789"
};

const ImportInvoicePrint = () => {
  const { id } = useParams(); // id is importInvoiceCode
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [supRes, invRes] = await Promise.all([
          supplierService.getAllSuppliers(),
          importInvoiceService.getById(id)
        ]);

        const suppliers = supRes?.data?.data || supRes?.data || [];
        const data = invRes?.data?.data || invRes?.data || invRes;
        const inv = data || {};

        const supplier =
          suppliers.find((s) => s.supplierCode === inv.supplierCode) || {};

        const items = (inv.details || inv.items || []).map((d) => ({
          productCode: d.productCode || d.product_code || d.productId,
          quantity: Number(d.quantity || d.qty || 0),
          unitPrice: Number(d.importPrice || d.unitPrice || d.price || 0)
        }));

        const rawDate =
          inv.created_date ||
          inv.createdDate ||
          inv.importDate ||
          inv.createdAt ||
          null;
        const importDate = rawDate
          ? new Date(rawDate).toLocaleDateString("vi-VN")
          : "";

        setInvoice({
          invoiceCode: inv.importInvoiceCode || inv.invoiceCode || id,
          supplierCode: inv.supplierCode,
          supplierName: supplier.supplierName || inv.supplierName || "",
          supplierAddress: supplier.address || "",
          supplierPhone: supplier.phone || supplier.mobile || "",
          importDate,
          totalAmount: Number(inv.totalAmount || inv.total || 0),
          notes: inv.description || inv.notes || "",
          items,
          _raw: inv
        });
      } catch (err) {
        console.error("Error loading print invoice", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    if (!loading && invoice) {
      // auto open print dialog shortly after render so styles apply
      setTimeout(() => {
        window.print();
      }, 200);
    }
  }, [loading, invoice]);

  if (loading) return <div className="p-6">Đang tải hóa đơn...</div>;
  if (!invoice) return <div className="p-6">Không tìm thấy hóa đơn.</div>;

  // compute totals
  const subtotal = invoice.items.reduce(
    (s, it) => s + (it.quantity || 0) * (it.unitPrice || 0),
    0
  );
  const discount = Number(invoice._raw?.discount || 0);
  const vat = Number(invoice._raw?.vat || invoice._raw?.tax || 0);
  const vatAmount = Math.round(((subtotal - discount) * vat) / 100);
  const grandTotal = Number(
    invoice.totalAmount || subtotal - discount + vatAmount
  );

  return (
    <div
      className="p-8 bg-white text-gray-900"
      style={{ maxWidth: 800, margin: "0 auto", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{STORE_INFO.name}</h1>
        <div className="text-sm text-gray-600 mb-1">{STORE_INFO.address}</div>
        <div className="text-sm text-gray-600 mb-1">
          Điện thoại: {STORE_INFO.phone} | Email: {STORE_INFO.email}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Mã số thuế: {STORE_INFO.taxCode}
        </div>

        <div className="border-b-2 border-gray-400 w-32 mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold mb-4">HÓA ĐƠN YÊU CẦU NHẬP HÀNG</h2>
        <div className="text-lg">
          Số: <strong>{invoice.invoiceCode}</strong>
        </div>
        <div className="text-sm text-gray-600">Ngày: {invoice.importDate}</div>
      </div>

      {/* Supplier Info */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Thông tin nhà cung cấp:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <strong>Tên nhà cung cấp:</strong>{" "}
                {invoice.supplierName || "___________"}
              </div>
              <div className="mb-2">
                <strong>Mã NCC:</strong> {invoice.supplierCode || "___________"}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <strong>Địa chỉ:</strong>{" "}
                {invoice.supplierAddress || "___________"}
              </div>
              <div className="mb-2">
                <strong>Điện thoại:</strong>{" "}
                {invoice.supplierPhone || "___________"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Chi tiết sản phẩm:</h3>

        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-3 py-2 text-center">
                  STT
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Mã sản phẩm
                </th>
                <th className="border border-gray-400 px-3 py-2 text-center">
                  Số lượng
                </th>
                <th className="border border-gray-400 px-3 py-2 text-center">
                  Đơn giá
                </th>
                <th className="border border-gray-400 px-3 py-2 text-center">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-3 py-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {it.productCode || "-"}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-center">
                    {it.quantity}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right">
                    {new Intl.NumberFormat("vi-VN").format(it.unitPrice || 0)} ₫
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right">
                    {new Intl.NumberFormat("vi-VN").format(
                      (it.quantity || 0) * (it.unitPrice || 0)
                    )}{" "}
                    ₫
                  </td>
                </tr>
              ))}
              {/* Empty rows if needed */}
              {invoice.items.length < 5 &&
                Array.from({ length: 5 - invoice.items.length }).map(
                  (_, idx) => (
                    <tr key={`empty-${idx}`}>
                      <td className="border border-gray-400 px-3 py-2 text-center">
                        {invoice.items.length + idx + 1}
                      </td>
                      <td className="border border-gray-400 px-3 py-2"></td>
                      <td className="border border-gray-400 px-3 py-2"></td>
                      <td className="border border-gray-400 px-3 py-2"></td>
                      <td className="border border-gray-400 px-3 py-2"></td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <div className="flex flex-col items-end">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("vi-VN").format(subtotal)} ₫
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Chiết khấu:</span>
                  <span className="text-red-600">
                    -{new Intl.NumberFormat("vi-VN").format(discount)} ₫
                  </span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Thuế VAT ({vat}%):</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(vatAmount)} ₫
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">TỔNG CỘNG:</span>
                  <span className="font-bold text-lg text-red-600">
                    {new Intl.NumberFormat("vi-VN").format(grandTotal)} ₫
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="italic">
                  Bằng chữ:{" "}
                  {grandTotal > 0
                    ? `${new Intl.NumberFormat("vi-VN").format(
                        grandTotal
                      )} đồng`
                    : "___________"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Ghi chú:</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm italic">
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-center">
            <div className="font-bold mb-2">Người giao hàng</div>
            <div className="text-sm text-gray-600 mb-16">
              (Ký và ghi rõ họ tên)
            </div>
            <div className="border-t border-gray-400 pt-2 mx-8">
              <div className="text-sm">_____________________</div>
            </div>
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">Người nhận hàng</div>
            <div className="text-sm text-gray-600 mb-16">
              (Ký và ghi rõ họ tên)
            </div>
            <div className="border-t border-gray-400 pt-2 mx-8">
              <div className="text-sm">_____________________</div>
            </div>
          </div>
        </div>
      </div>

      {/* Print button */}
      <div className="mt-28 print:hidden text-right">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          In hóa đơn
        </button>
      </div>
    </div>
  );
};

export default ImportInvoicePrint;
