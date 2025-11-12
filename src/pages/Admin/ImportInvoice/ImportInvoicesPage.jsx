import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaPlus,
  FaTimes,
  FaStickyNote,
  FaTimesCircle,
  FaFileInvoice,
  FaHome,
  FaFileExport,
  FaExclamationTriangle,
  FaCheck,
  FaInfoCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaSearch,
  FaEye,
  FaTrash,
  FaUndo,
  FaFilter,
  FaSort,
  FaDownload,
  FaClock,
  FaTruck,
  FaBoxes,
  FaCalendarAlt,
  FaDollarSign
} from "react-icons/fa";
import { importInvoiceService } from "~/apis/importInvoiceService";
import { supplierService } from "~/apis/supplierService";
import { productService } from "~/apis/productService";
import { buildImageUrl } from "~/lib/utils";
import { useNavigate } from "react-router-dom";
import AdminLayout from "~/components/Admin/AdminLayout";
import Modal from "~/components/Admin/Modal";
import Pagination from "~/components/Admin/Pagination";

const ImportInvoicesPage = () => {
  const [importInvoices, setImportInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [autoInvoiceCode, setAutoInvoiceCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "invoiceCode",
    direction: "asc"
  });
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [invoiceItems, setInvoiceItems] = useState([
    { importInvoiceDetailCode: "", productCode: "", quantity: 1, unitPrice: 0 }
  ]);

  // Display mode state
  const [displayMode, setDisplayMode] = useState("supplier-first"); // "supplier-first" or "product-first"
  const [selectedSupplierCode, setSelectedSupplierCode] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  // helper to convert API datetime/string to yyyy-mm-dd for <input type="date">
  const formatToDateInput = (value) => {
    if (!value) return "";
    // if value contains T (ISO), take date part, otherwise try to parse simple formats
    try {
      if (typeof value === "string" && value.includes("T"))
        return value.split("T")[0];
      // if it's a number (timestamp)
      if (typeof value === "number") {
        const d = new Date(value);
        return d.toISOString().split("T")[0];
      }
      // fallback: attempt Date parse
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
      return "";
    } catch (err) {
      return "";
    }
  };
  const navigate = useNavigate();

  // Confirmation modal helpers
  const showSuccessModal = (title, message) =>
    setConfirmModal({
      isOpen: true,
      type: "success",
      title,
      message,
      confirmText: "OK",
      onConfirm: () => setConfirmModal({ isOpen: false })
    });

  const showErrorModal = (title, message) =>
    setConfirmModal({
      isOpen: true,
      type: "error",
      title,
      message,
      confirmText: "OK",
      onConfirm: () => setConfirmModal({ isOpen: false })
    });

  const showDeleteConfirm = (invoiceCode, invoiceNote) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      title: "Xóa hóa đơn nhập hàng",
      message: `Bạn có chắc muốn xóa hóa đơn "${invoiceCode}"?`,
      cancelText: "Hủy bỏ",
      confirmText: "Xóa",
      onCancel: () => setConfirmModal({ isOpen: false }),
      onConfirm: async () => {
        setLoading(true);
        try {
          await importInvoiceService.deleteImportInvoice(invoiceCode);
          await loadImportInvoices();
          showSuccessModal(
            "Xóa thành công",
            `Hóa đơn "${invoiceCode}" đã được xóa.`
          );
        } catch (err) {
          console.error(err);
          showErrorModal(
            "Xóa thất bại",
            `Không thể xóa hóa đơn "${invoiceCode}". Vui lòng thử lại sau.`
          );
        } finally {
          setLoading(false);
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  const showRestoreConfirm = (invoice) => {
    const id = invoice.importInvoiceCode || invoice.invoiceCode;
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Khôi phục hóa đơn",
      message: `Bạn có chắc muốn khôi phục hóa đơn "${id}" về trạng thái chờ duyệt?`,
      cancelText: "Hủy bỏ",
      confirmText: "Khôi phục",
      onCancel: () => setConfirmModal({ isOpen: false }),
      onConfirm: async () => {
        setLoading(true);
        try {
          // update status to PENDING
          await importInvoiceService.updateImportInvoice(id, {
            status: STATUS.PENDING
          });
          await loadImportInvoices();
          showSuccessModal(
            "Khôi phục thành công",
            `Hóa đơn "${id}" đã được khôi phục về trạng thái chờ duyệt.`
          );
        } catch (err) {
          console.error(err);
          showErrorModal(
            "Khôi phục thất bại",
            `Không thể khôi phục hóa đơn "${id}". Vui lòng thử lại sau.`
          );
        } finally {
          setLoading(false);
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  // Load import invoices
  const loadImportInvoices = async () => {
    try {
      setLoading(true);
      const response = await importInvoiceService.getAllImportInvoices();
      let invoicesData = response?.data?.data || response?.data || [];
      // normalize API shapes coming from backend
      invoicesData = invoicesData.map((inv) => ({
        // keep original backend fields
        ...inv,
        // friendly aliases used by the UI
        invoiceCode: inv.importInvoiceCode || inv.invoiceCode || "",
        notes: inv.description || inv.notes || "",
        // map createdDate/created_date -> importDate for UI (user: 'Ngày nhập là createdDate')
        importDate: formatToDateInput(
          inv.createdDate ||
            inv.created_date ||
            inv.importDate ||
            inv.importedDate ||
            ""
        ),
        // map details -> items for UI editing
        items: (inv.details || inv.items || []).map((d) => ({
          id: d.id,
          detailCode: d.importInvoiceDetailCode || d.detailCode,
          productCode: d.productCode,
          quantity: d.quantity,
          unitPrice: d.importPrice || d.unitPrice || 0,
          totalAmount: d.totalAmount
        })),
        // normalize status -> string constants (keep backward compatibility)
        status: (() => {
          if (typeof inv.status === "string") {
            const s = inv.status.trim().toUpperCase();
            if (s === "1" || s === "TRUE") return STATUS.APPROVED;
            if (s === "0" || s === "FALSE") return STATUS.PENDING;
            if (
              s === STATUS.PENDING ||
              s === STATUS.APPROVED ||
              s === STATUS.REJECTED ||
              s === STATUS.DELETED
            )
              return s;
            return s; // unknown raw string
          }
          if (typeof inv.status === "boolean")
            return inv.status ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof inv.status === "number")
            return inv.status === 1 ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof inv.approved === "boolean")
            return inv.approved ? STATUS.APPROVED : STATUS.PENDING;
          return STATUS.PENDING;
        })(),
        approved: (function (st) {
          const s = (() => {
            if (typeof inv.status === "string")
              return inv.status.trim().toUpperCase();
            if (typeof inv.status === "boolean")
              return inv.status ? STATUS.APPROVED : STATUS.PENDING;
            if (typeof inv.status === "number")
              return inv.status === 1 ? STATUS.APPROVED : STATUS.PENDING;
            if (typeof inv.approved === "boolean")
              return inv.approved ? STATUS.APPROVED : STATUS.PENDING;
            return STATUS.PENDING;
          })();
          return s === STATUS.APPROVED;
        })()
      }));
      setImportInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading import invoices:", error);
      showErrorModal("Lỗi", "Không thể tải danh sách hóa đơn nhập hàng");
    } finally {
      setLoading(false);
    }
  };

  // Load suppliers and products for dropdowns
  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getAllSuppliers();
      let suppliersData = response?.data?.data || response?.data || [];
      // normalize status to boolean so UI can reliably filter active suppliers
      suppliersData = suppliersData.map((s) => ({
        ...s,
        status: (() => {
          if (typeof s.status === "boolean") return s.status;
          // check common active indicators
          const raw = (s.status ?? s.active ?? "")
            .toString()
            .trim()
            .toLowerCase();
          return raw === "true" || raw === "1" || raw === "active";
        })()
      }));
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error loading suppliers:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProduct();
      setProducts(response?.data?.data || response?.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Load products for selected supplier
  const loadProductsForSupplier = async (supplierCode) => {
    if (!supplierCode) {
      setFilteredProducts([]);
      return;
    }

    try {
      const supplier = suppliers.find((s) => s.supplierCode === supplierCode);
      if (supplier && supplier.productProvide) {
        // Get product codes from supplier's productProvide
        const productCodes = supplier.productProvide.map(
          (pp) => pp.productCode
        );
        // Filter products that this supplier provides
        const supplierProducts = products.filter((p) =>
          productCodes.includes(p.productCode || p.code || p.id)
        );
        setFilteredProducts(supplierProducts);
      } else {
        // Fallback: show all products if no productProvide data
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error("Error loading products for supplier:", error);
      setFilteredProducts([]);
    }
  };

  // Load suppliers for selected product
  const loadSuppliersForProduct = async (productCode) => {
    if (!productCode) {
      setFilteredSuppliers([]);
      return;
    }

    try {
      // Find suppliers that provide this product
      const productSuppliers = suppliers.filter((supplier) => {
        if (supplier.productProvide && Array.isArray(supplier.productProvide)) {
          return supplier.productProvide.some(
            (pp) => pp.productCode === productCode
          );
        }
        return false;
      });
      setFilteredSuppliers(productSuppliers);
    } catch (error) {
      console.error("Error loading suppliers for product:", error);
      setFilteredSuppliers([]);
    }
  };

  // Search and filter
  useEffect(() => {
    let filtered = importInvoices;

    if (searchTerm) {
      filtered = filtered.filter((invoice) => {
        const term = searchTerm.toLowerCase();
        return (
          (invoice.invoiceCode || invoice.importInvoiceCode || "")
            .toString()
            .toLowerCase()
            .includes(term) ||
          (invoice.supplierCode || "")
            .toString()
            .toLowerCase()
            .includes(term) ||
          (invoice.notes || invoice.description || "")
            .toString()
            .toLowerCase()
            .includes(term)
        );
      });
    }

    // Filter by status (all / pending / approved)
    if (filterStatus === "pending") {
      filtered = filtered.filter((inv) => inv.status === STATUS.PENDING);
    } else if (filterStatus === "approved") {
      filtered = filtered.filter((inv) => inv.status === STATUS.APPROVED);
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (sortConfig.direction === "asc") {
          return aValue.toString().localeCompare(bValue.toString());
        } else {
          return bValue.toString().localeCompare(aValue.toString());
        }
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [importInvoices, searchTerm, sortConfig, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle sort
  const handleEdit = async (invoice) => {
    // fetch full invoice details by importInvoiceCode before editing
    const id = invoice.importInvoiceCode || invoice.invoiceCode;
    if (!id) {
      showErrorModal("Lỗi", "Không tìm thấy mã hóa đơn để chỉnh sửa.");
      return;
    }
    setLoading(true);
    try {
      const res = await importInvoiceService.getById(id);
      const data = res?.data?.data || res?.data || res;
      const inv = {
        ...data,
        invoiceCode: data.importInvoiceCode || data.invoiceCode || "",
        notes: data.description || data.notes || "",
        importDate: formatToDateInput(
          data.createdDate || data.created_date || data.importDate || ""
        ),
        items: (data.details || data.items || []).map((d) => ({
          id: d.id,
          detailCode: d.importInvoiceDetailCode || d.detailCode,
          productCode: d.productCode,
          quantity: d.quantity,
          unitPrice: d.importPrice || d.unitPrice || 0,
          totalAmount: d.totalAmount
        })),
        status: (() => {
          if (typeof data.status === "string") {
            const s = data.status.trim().toUpperCase();
            if (s === "1" || s === "TRUE") return STATUS.APPROVED;
            if (s === "0" || s === "FALSE") return STATUS.PENDING;
            if (
              s === STATUS.PENDING ||
              s === STATUS.APPROVED ||
              s === STATUS.REJECTED ||
              s === STATUS.DELETED
            )
              return s;
            return s;
          }
          if (typeof data.status === "boolean")
            return data.status ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof data.status === "number")
            return data.status === 1 ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof data.approved === "boolean")
            return data.approved ? STATUS.APPROVED : STATUS.PENDING;
          return STATUS.PENDING;
        })()
      };

      setEditingInvoice(inv);
      setInvoiceItems(
        inv.items && inv.items.length > 0
          ? inv.items.map((it) => ({
              productCode: it.productCode,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              // preserve original detail id/code so update payload can include it
              importInvoiceDetailCode:
                it.detailCode || it.importInvoiceDetailCode || it.id || null
            }))
          : [
              {
                importInvoiceDetailCode: "",
                productCode: "",
                quantity: 1,
                unitPrice: 0
              }
            ]
      );
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error loading invoice for edit:", err);
      showErrorModal("Lỗi", "Không thể tải chi tiết hóa đơn để chỉnh sửa.");
    } finally {
      setLoading(false);
    }
  };

  const removeInvoiceItem = (index) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const updateInvoiceItem = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    setInvoiceItems(updated);
  };

  // Add a new empty item row (only used when creating a new invoice)
  const addInvoiceItem = () => {
    // Prevent adding new rows when using product-first mode
    if (displayMode === "product-first") {
      showErrorModal(
        "Không thể thêm sản phẩm",
        "Khi đã chọn sản phẩm trước, không thể thêm dòng sản phẩm mới."
      );
      return;
    }
    // generate detail code if creating new invoice
    const genDetailCode = `CTPN_${Date.now()}`;
    setInvoiceItems([
      ...invoiceItems,
      {
        importInvoiceDetailCode: genDetailCode,
        productCode: "",
        quantity: 1,
        unitPrice: 0
      }
    ]);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => {
      return (
        total +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
      );
    }, 0);
  };

  // Handle form submission
  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    // Build payload matching backend shape
    const formStatus = formData.get("status");
    const normalizedStatus = formStatus
      ? formStatus.toString().trim().toUpperCase()
      : editingInvoice?.status || STATUS.PENDING;

    const invoiceData = {
      importInvoiceCode: formData.get("invoiceCode"),
      supplierCode: formData.get("supplierCode"),
      // backend expects created_date as the invoice date
      created_date: formData.get("importDate") || undefined,
      description: formData.get("notes"),
      details: invoiceItems
        .filter((item) => item.productCode && Number(item.quantity) > 0)
        .map((item) => ({
          importInvoiceDetailCode:
            item.importInvoiceDetailCode || item.detailCode || item.id || null,
          productCode: item.productCode,
          quantity: Number(item.quantity),
          importPrice: Number(item.unitPrice) || 0,
          totalAmount:
            (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
        })),
      totalAmount: calculateTotal(),
      discount: Number(formData.get("discount") || 0),
      reason: formData.get("reason") || null,
      // status: send canonical string (APPROVED/PENDING/REJECTED/DELETED)
      status: normalizedStatus,
      // default employee code when editing/creating if not provided by UI
      employeeCode: editingInvoice?.employeeCode || "NV_KETOAN"
    };

    // Validate items
    if (invoiceData.details.length === 0) {
      showErrorModal("Lỗi", "Phải có ít nhất một sản phẩm trong hóa đơn");
      setLoading(false);
      return;
    }

    try {
      if (editingInvoice) {
        // prefer backend key if present
        const id =
          editingInvoice.importInvoiceCode || editingInvoice.invoiceCode;
        await importInvoiceService.updateImportInvoice(id, invoiceData);
        showSuccessModal(
          "Cập nhật thành công",
          "Hóa đơn nhập hàng đã được cập nhật"
        );
      } else {
        await importInvoiceService.createImportInvoice(invoiceData);
        showSuccessModal(
          "Tạo thành công",
          "Hóa đơn nhập hàng mới đã được tạo (chờ duyệt)"
        );
      }

      setIsModalOpen(false);
      setEditingInvoice(null);
      setInvoiceItems([
        {
          importInvoiceDetailCode: "",
          productCode: "",
          quantity: 1,
          unitPrice: 0
        }
      ]);
      await loadImportInvoices();
    } catch (error) {
      console.error("Error saving invoice:", error);
      showErrorModal(
        "Lỗi",
        editingInvoice ? "Không thể cập nhật hóa đơn" : "Không thể tạo hóa đơn"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle view
  const handleView = async (invoice) => {
    const id = invoice.importInvoiceCode || invoice.invoiceCode;
    if (!id) {
      showErrorModal("Lỗi", "Không tìm thấy mã hóa đơn để xem chi tiết.");
      return;
    }
    setLoading(true);
    try {
      const res = await importInvoiceService.getById(id);
      const data = res?.data?.data || res?.data || res;
      const inv = {
        ...data,
        invoiceCode: data.importInvoiceCode || data.invoiceCode || "",
        notes: data.description || data.notes || "",
        importDate: formatToDateInput(
          data.createdDate || data.created_date || data.importDate || ""
        ),
        items: (data.details || data.items || []).map((d) => ({
          id: d.id,
          detailCode: d.importInvoiceDetailCode || d.detailCode,
          productCode: d.productCode,
          quantity: d.quantity,
          unitPrice: d.importPrice || d.unitPrice || 0,
          totalAmount: d.totalAmount
        })),
        status: (() => {
          if (typeof data.status === "string") {
            const s = data.status.trim().toUpperCase();
            if (s === "1" || s === "TRUE") return STATUS.APPROVED;
            if (s === "0" || s === "FALSE") return STATUS.PENDING;
            if (
              s === STATUS.PENDING ||
              s === STATUS.APPROVED ||
              s === STATUS.REJECTED ||
              s === STATUS.DELETED
            )
              return s;
            return s;
          }
          if (typeof data.status === "boolean")
            return data.status ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof data.status === "number")
            return data.status === 1 ? STATUS.APPROVED : STATUS.PENDING;
          if (typeof data.approved === "boolean")
            return data.approved ? STATUS.APPROVED : STATUS.PENDING;
          return STATUS.PENDING;
        })()
      };

      setViewingInvoice(inv);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error loading invoice details:", err);
      showErrorModal("Lỗi", "Không thể tải chi tiết hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = (invoice) => {
    const id = invoice.importInvoiceCode || invoice.invoiceCode;
    showDeleteConfirm(id, invoice.notes || invoice.description);
  };

  // Export invoices
  const handleExport = () => {
    const csvContent = [
      [
        "Mã hóa đơn",
        "Mã NCC",
        "Ngày nhập",
        "Tổng tiền",
        "Trạng thái",
        "Ghi chú"
      ],
      ...filteredInvoices.map((invoice) => [
        invoice.importInvoiceCode || invoice.invoiceCode,
        invoice.supplierCode,
        invoice.importDate || "",
        invoice.totalAmount,
        statusToLabel(invoice.status),
        invoice.description || invoice.notes || ""
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-invoices.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadImportInvoices();
    loadSuppliers();
    loadProducts();
  }, []);

  // When in product-first mode and a product is selected, ensure every invoice item uses that productCode
  useEffect(() => {
    if (
      !editingInvoice &&
      displayMode === "product-first" &&
      selectedProductCode
    ) {
      setInvoiceItems((prev) =>
        prev.map((it) => ({
          ...it,
          productCode: selectedProductCode
        }))
      );

      // If supplier already selected, try to prefill unitPrice from supplier.productProvide
      if (selectedSupplierCode) {
        const supplier = suppliers.find(
          (s) => s.supplierCode === selectedSupplierCode
        );
        if (supplier && supplier.productProvide) {
          const pp = supplier.productProvide.find(
            (p) => p.productCode === selectedProductCode
          );
          if (pp && pp.importPrice) {
            setInvoiceItems((prev) =>
              prev.map((it) => ({ ...it, unitPrice: pp.importPrice }))
            );
          }
        }
      }
    }
  }, [
    selectedProductCode,
    displayMode,
    editingInvoice,
    selectedSupplierCode,
    suppliers
  ]);

  // When selected supplier changes in product-first mode, update unitPrice for items that match selectedProductCode
  useEffect(() => {
    if (
      !editingInvoice &&
      displayMode === "product-first" &&
      selectedSupplierCode &&
      selectedProductCode
    ) {
      const supplier = suppliers.find(
        (s) => s.supplierCode === selectedSupplierCode
      );
      if (supplier && supplier.productProvide) {
        const pp = supplier.productProvide.find(
          (p) => p.productCode === selectedProductCode
        );
        if (pp) {
          setInvoiceItems((prev) =>
            prev.map((it) =>
              it.productCode === selectedProductCode
                ? { ...it, unitPrice: pp.importPrice || it.unitPrice }
                : it
            )
          );
        }
      }
    }
  }, [
    selectedSupplierCode,
    selectedProductCode,
    displayMode,
    editingInvoice,
    suppliers
  ]);

  // Status constants (match API)
  const STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    DELETED: "DELETED"
  };

  const statusToLabel = (s) => {
    switch (s) {
      case STATUS.APPROVED:
        return "Đã duyệt";
      case STATUS.PENDING:
        return "Chờ duyệt";
      case STATUS.REJECTED:
        return "Đã từ chối";
      case STATUS.DELETED:
        return "Đã xóa";
      default:
        return s || "N/A";
    }
  };

  // counts for pending / approved invoices
  const pendingCount = importInvoices.filter(
    (inv) => inv.status === STATUS.PENDING
  ).length;
  const approvedCount = importInvoices.filter(
    (inv) => inv.status === STATUS.APPROVED
  ).length;
  const rejectedCount = importInvoices.filter(
    (inv) => inv.status === STATUS.REJECTED
  ).length;
  const deletedCount = importInvoices.filter(
    (inv) => inv.status === STATUS.DELETED
  ).length;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaFileInvoice className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý hóa đơn nhập hàng
                </h1>
                <p className="text-gray-600">
                  Tạo và quản lý các hóa đơn nhập hàng
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaDownload />
                Xuất Excel
              </button>
              <button
                onClick={() => {
                  // Auto-generate invoice code and first detail code for new invoice
                  const genInvoiceCode = `PN_${new Date()
                    .toISOString()
                    .replace(/[^0-9]/g, "")}`;
                  setAutoInvoiceCode(genInvoiceCode);
                  setEditingInvoice(null);
                  setInvoiceItems([
                    {
                      importInvoiceDetailCode: `CTPN_${Date.now()}`,
                      productCode: "",
                      quantity: 1,
                      unitPrice: 0
                    }
                  ]);
                  // Reset display mode state
                  setSelectedSupplierCode("");
                  setSelectedProductCode("");
                  setFilteredProducts([]);
                  setFilteredSuppliers([]);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Tạo hóa đơn nhập hàng
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã hóa đơn, mã NCC, ghi chú..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-2 rounded-lg border ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700"
                }`}
                title="Hiển thị tất cả"
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-3 py-2 rounded-lg border ${
                  filterStatus === "pending"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700"
                }`}
                title="Chỉ hiển thị hóa đơn chờ duyệt"
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-3 py-2 rounded-lg border ${
                  filterStatus === "approved"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700"
                }`}
                title="Chỉ hiển thị hóa đơn đã duyệt"
              >
                Đã duyệt
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 / trang</option>
                <option value={25}>25 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng hóa đơn
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {importInvoices.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaFileInvoice className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-orange-700">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-700">
                  {approvedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheck className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xóa</p>
                <p className="text-2xl font-bold text-gray-700">
                  {deletedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaTrash className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("invoiceCode")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Mã hóa đơn
                      <FaSort className="text-xs" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày nhập
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không có hóa đơn nhập hàng nào
                    </td>
                  </tr>
                ) : (
                  currentInvoices.map((invoice, index) => (
                    <tr
                      key={invoice.invoiceCode || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.invoiceCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.supplierCode || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.importDate || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND"
                          }).format(invoice.totalAmount || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === STATUS.APPROVED
                              ? "bg-green-100 text-green-800"
                              : invoice.status === STATUS.PENDING
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {invoice.status === STATUS.APPROVED
                            ? "Đã duyệt"
                            : invoice.status === STATUS.PENDING
                            ? "Chờ duyệt"
                            : statusToLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(invoice)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          {invoice.status === STATUS.PENDING && (
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                          )}

                          {invoice.status === STATUS.DELETED && (
                            <button
                              onClick={() => showRestoreConfirm(invoice)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Khôi phục hóa đơn"
                            >
                              <FaUndo />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInvoice(null);
            setInvoiceItems([
              {
                importInvoiceDetailCode: "",
                productCode: "",
                quantity: 1,
                unitPrice: 0
              }
            ]);
          }}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {editingInvoice ? (
                  <FaEdit className="text-blue-600" />
                ) : (
                  <FaPlus className="text-blue-600" />
                )}
              </div>
              <span>
                {editingInvoice
                  ? "Chỉnh sửa hóa đơn nhập hàng"
                  : "Tạo hóa đơn nhập hàng mới"}
              </span>
            </div>
          }
          size="xl"
        >
          <form onSubmit={handleSaveInvoice} className="space-y-6">
            {/* Display Mode Toggle - only show when creating new invoice */}
            {!editingInvoice && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn cách tạo hóa đơn
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDisplayMode("supplier-first");
                      setSelectedSupplierCode("");
                      setSelectedProductCode("");
                      setFilteredProducts([]);
                      setFilteredSuppliers([]);
                    }}
                    aria-pressed={displayMode === "supplier-first"}
                    className={`flex items-start gap-3 p-4 rounded-lg transition-shadow border ${
                      displayMode === "supplier-first"
                        ? "ring-2 ring-blue-500 bg-white border-blue-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border-transparent"
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded bg-blue-50 text-blue-600">
                      <FaTruck />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        Chọn nhà cung cấp trước
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Chọn NCC rồi chọn sản phẩm mà NCC này cung cấp. Thích
                        hợp khi bạn đã biết NCC.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDisplayMode("product-first");
                      setSelectedSupplierCode("");
                      setSelectedProductCode("");
                      setFilteredProducts([]);
                      setFilteredSuppliers([]);
                    }}
                    aria-pressed={displayMode === "product-first"}
                    className={`flex items-start gap-3 p-4 rounded-lg transition-shadow border ${
                      displayMode === "product-first"
                        ? "ring-2 ring-green-500 bg-white border-green-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border-transparent"
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded bg-green-50 text-green-600">
                      <FaBoxes />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        Chọn sản phẩm trước
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Chọn sản phẩm rồi chọn NCC cung cấp. Thích hợp khi bạn
                        biết sản phẩm cần nhập.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã hóa đơn *
                </label>
                <input
                  type="text"
                  name="invoiceCode"
                  defaultValue={
                    editingInvoice?.invoiceCode || autoInvoiceCode || ""
                  }
                  required
                  readOnly={true}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed`}
                  placeholder="Mã hóa đơn tự động"
                />
              </div>

              {/* Conditional rendering based on display mode */}
              {editingInvoice || displayMode === "supplier-first" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà cung cấp *
                  </label>
                  <select
                    name="supplierCode"
                    value={
                      editingInvoice
                        ? editingInvoice.supplierCode || ""
                        : selectedSupplierCode
                    }
                    onChange={(e) => {
                      const supplierCode = e.target.value;
                      setSelectedSupplierCode(supplierCode);
                      if (!editingInvoice) {
                        loadProductsForSupplier(supplierCode);
                      }
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {(editingInvoice
                      ? suppliers
                      : suppliers.filter((s) => s && s.status === true)
                    ).map((supplier) => (
                      <option
                        key={supplier.supplierCode}
                        value={supplier.supplierCode}
                      >
                        {supplier.supplierName} ({supplier.email})
                      </option>
                    ))}
                  </select>
                  {!editingInvoice && selectedSupplierCode && (
                    <p className="text-xs text-blue-600 mt-1">
                      Sản phẩm bên dưới sẽ hiển thị từ nhà cung cấp đã chọn
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn sản phẩm để xem nhà cung cấp *
                  </label>
                  <select
                    value={selectedProductCode}
                    onChange={(e) => {
                      const productCode = e.target.value;
                      setSelectedProductCode(productCode);
                      loadSuppliersForProduct(productCode);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((product) => (
                      <option
                        key={product.productCode || product.code || product.id}
                        value={
                          product.productCode || product.code || product.id
                        }
                      >
                        {product.productName || product.name} (
                        {product.productCode || product.code})
                      </option>
                    ))}
                  </select>
                  {selectedProductCode && filteredSuppliers.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nhà cung cấp cho sản phẩm này:
                      </label>
                      <select
                        name="supplierCode"
                        value={selectedSupplierCode}
                        onChange={(e) =>
                          setSelectedSupplierCode(e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn nhà cung cấp</option>
                        {filteredSuppliers.map((supplier) => (
                          <option
                            key={supplier.supplierCode}
                            value={supplier.supplierCode}
                          >
                            {supplier.supplierName} ({supplier.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedProductCode && filteredSuppliers.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Không có nhà cung cấp nào cho sản phẩm này
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhập *
                </label>
                {/* If editing, show disabled date (non-editable) and include a hidden input with the real name so the value is submitted.
                    If creating, show a normal editable date input named 'importDate' so it is submitted directly. */}
                {editingInvoice ? (
                  <>
                    <input
                      type="date"
                      name="importDate_disabled"
                      defaultValue={editingInvoice?.importDate || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <input
                      type="hidden"
                      name="importDate"
                      value={editingInvoice.importDate || ""}
                    />
                  </>
                ) : (
                  <input
                    type="date"
                    name="importDate"
                    defaultValue={
                      editingInvoice?.importDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                rows="3"
                defaultValue={editingInvoice?.notes || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập ghi chú..."
              />
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết sản phẩm
                </h3>
                {/* Show add button only when creating a new invoice (not when editing) */}
                {!editingInvoice && displayMode !== "product-first" && (
                  <button
                    type="button"
                    onClick={addInvoiceItem}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="text-xs" />
                    Thêm sản phẩm
                  </button>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Mã chi tiết
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Đơn giá
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.importInvoiceDetailCode || ""}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {!editingInvoice &&
                          displayMode === "product-first" ? (
                            // When product-first, show chosen product as static text
                            (() => {
                              const code =
                                item.productCode || selectedProductCode || "";
                              const prod =
                                products.find(
                                  (p) =>
                                    (p.productCode || p.code || p.id) === code
                                ) || {};
                              const name =
                                prod.productName || prod.name || code;
                              return (
                                <div className="flex items-center gap-3">
                                  {prod.image ? (
                                    <img
                                      src={buildImageUrl(prod.image)}
                                      alt={name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                      No Img
                                    </div>
                                  )}
                                  <div className="text-sm text-gray-900">
                                    <div className="font-medium">{name}</div>
                                    {code && (
                                      <div className="text-xs text-gray-500">
                                        {code}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex items-center gap-3">
                              {(() => {
                                // show thumbnail for currently selected product in this row (if any)
                                const selCode = item.productCode || "";
                                const selProd =
                                  products.find(
                                    (p) =>
                                      (p.productCode || p.code || p.id) ===
                                      selCode
                                  ) || {};
                                return selProd.image ? (
                                  <img
                                    src={buildImageUrl(selProd.image)}
                                    alt={
                                      selProd.productName ||
                                      selProd.name ||
                                      selCode
                                    }
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                    No Img
                                  </div>
                                );
                              })()}

                              <select
                                value={item.productCode}
                                onChange={(e) => {
                                  const productCode = e.target.value;
                                  updateInvoiceItem(
                                    index,
                                    "productCode",
                                    productCode
                                  );

                                  // Auto-fill import price from supplier's productProvide if available
                                  if (selectedSupplierCode && productCode) {
                                    const supplier = suppliers.find(
                                      (s) =>
                                        s.supplierCode === selectedSupplierCode
                                    );
                                    if (supplier && supplier.productProvide) {
                                      const productProvide =
                                        supplier.productProvide.find(
                                          (pp) => pp.productCode === productCode
                                        );
                                      if (
                                        productProvide &&
                                        productProvide.importPrice
                                      ) {
                                        updateInvoiceItem(
                                          index,
                                          "unitPrice",
                                          productProvide.importPrice
                                        );
                                      }
                                    }
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="">Chọn sản phẩm</option>
                                {/* Use filtered products if available, otherwise use all products */}
                                {(!editingInvoice &&
                                displayMode === "supplier-first" &&
                                filteredProducts.length > 0
                                  ? filteredProducts
                                  : !editingInvoice &&
                                    displayMode === "product-first" &&
                                    selectedProductCode
                                  ? products.filter(
                                      (p) =>
                                        (p.productCode || p.code || p.id) ===
                                        selectedProductCode
                                    )
                                  : products
                                ).map((product) => {
                                  const code =
                                    product.productCode ||
                                    product.code ||
                                    product.id ||
                                    "";
                                  const name =
                                    product.productName || product.name || "";
                                  return (
                                    <option key={code} value={code}>
                                      {name} ({code})
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND"
                            }).format(
                              (parseFloat(item.quantity) || 0) *
                                (parseFloat(item.unitPrice) || 0)
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            disabled={invoiceItems.length === 1}
                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-right font-medium text-gray-900"
                      >
                        Tổng cộng:
                      </td>
                      <td></td>
                      <td className="px-4 py-3 font-bold text-lg text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND"
                        }).format(calculateTotal())}
                      </td>

                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              {/* hidden fields required by backend payload */}
              <input
                type="hidden"
                name="discount"
                value={editingInvoice?.discount ?? 0}
              />
              <input
                type="hidden"
                name="reason"
                value={editingInvoice?.reason ?? ""}
              />
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingInvoice(null);
                  setInvoiceItems([
                    { productCode: "", quantity: 1, unitPrice: 0 }
                  ]);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {editingInvoice ? "Cập nhật" : "Tạo hóa đơn"}
              </button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingInvoice(null);
          }}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaEye className="text-green-600" />
              </div>
              <span>Chi tiết hóa đơn nhập hàng</span>
            </div>
          }
          size="xl"
        >
          {viewingInvoice && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaFileInvoice className="inline mr-2" />
                      Mã hóa đơn
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-medium">
                      {viewingInvoice.invoiceCode || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaTruck className="inline mr-2" />
                      Nhà cung cấp
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      <p className="text-gray-900 font-medium">
                        {viewingInvoice.supplierName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {viewingInvoice.supplierCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline mr-2" />
                      Ngày nhập
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewingInvoice.importDate || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        viewingInvoice.status === STATUS.APPROVED
                          ? "bg-green-100 text-green-800"
                          : viewingInvoice.status === STATUS.PENDING
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {viewingInvoice.status === STATUS.APPROVED
                        ? "Đã duyệt"
                        : viewingInvoice.status === STATUS.PENDING
                        ? "Chờ duyệt"
                        : statusToLabel(viewingInvoice.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaStickyNote className="inline mr-2" />
                  Ghi chú
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[60px]">
                  {viewingInvoice.notes || "Không có ghi chú"}
                </p>
              </div>

              {/* Items table */}
              {viewingInvoice.items && viewingInvoice.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chi tiết sản phẩm
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Sản phẩm
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Số lượng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Đơn giá
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {viewingInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.productCode}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                              }).format(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                              }).format(item.quantity * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-right font-medium text-gray-900"
                          >
                            Tổng cộng:
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND"
                            }).format(viewingInvoice.totalAmount || 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewingInvoice(null);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false })}
          title={
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  confirmModal.type === "success"
                    ? "bg-green-100"
                    : confirmModal.type === "error"
                    ? "bg-red-100"
                    : confirmModal.type === "delete"
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}
              >
                {confirmModal.type === "success" && (
                  <FaCheck className="text-green-600" />
                )}
                {confirmModal.type === "error" && (
                  <FaExclamationTriangle className="text-red-600" />
                )}
                {confirmModal.type === "delete" && (
                  <FaExclamationTriangle className="text-red-600" />
                )}
                {confirmModal.type === "info" && (
                  <FaInfoCircle className="text-blue-600" />
                )}
              </div>
              <span>{confirmModal.title}</span>
            </div>
          }
        >
          <div className="text-gray-700 mb-6">{confirmModal.message}</div>
          <div className="flex justify-end gap-3">
            {confirmModal.onCancel && (
              <button
                onClick={confirmModal.onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {confirmModal.cancelText || "Hủy"}
              </button>
            )}
            <button
              onClick={confirmModal.onConfirm}
              className={`px-4 py-2 rounded-lg transition-colors ${
                confirmModal.type === "delete"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {confirmModal.confirmText || "OK"}
            </button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ImportInvoicesPage;
