import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaPrint,
  FaCreditCard,
  FaMoneyBillWave,
  FaUser,
  FaTachometerAlt,
  FaBarcode,
  FaCalculator
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../apis/productService";
import promotionService from "../../../apis/promotionService";
import { orderService } from "../../../apis/orderService";
import { buildImageUrl } from "../../../lib/utils";
import InvoiceModal from "../../../components/InvoiceModal/InvoiceModal";
import { toast } from "react-toastify";

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadPromotions();
  }, []);

  const loadProducts = async () => {
    try {
      const resp = await productService.getAllProduct();
      let data = [];
      if (!resp) data = [];
      else if (Array.isArray(resp.data)) data = resp.data;
      else if (resp.data && Array.isArray(resp.data.data))
        data = resp.data.data;
      else if (resp.data && Array.isArray(resp.data.items))
        data = resp.data.items;
      else data = Array.isArray(resp.data) ? resp.data : [];
      setProducts(data);

      const cats = [];
      (data || []).forEach((p) => {
        if (
          p &&
          p.categoryCode &&
          !cats.find((c) => c.categoryCode === p.categoryCode)
        ) {
          cats.push({
            categoryCode: p.categoryCode,
            categoryName: p.categoryName || ""
          });
        }
      });
      setCategories(cats);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPromotions = async () => {
    try {
      const res = await promotionService.getAllPromotions();
      const data = res?.data?.data || [];
      const active = data.filter(
        (p) => p.status && (!p.endDate || new Date(p.endDate) > new Date())
      );
      setPromotions(active);
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (v) => Number(v || 0).toLocaleString("vi-VN");

  const normalizeImage = (img) => {
    if (!img) return null;
    if (typeof img !== "string") return img;
    if (img.startsWith("blob:") || img.startsWith("data:")) return img;
    return buildImageUrl(img);
  };

  const getDiscountedPrice = (product) => {
    const original = Number(product?.price || 0);
    const promotion = promotions.find(
      (p) => p.promotionCode === product?.promotionCode
    );
    const promoValue = promotion?.value ?? product?.discountValue ?? null;
    if (!promoValue) return original;
    const v = Number(promoValue);
    if (Number.isNaN(v)) return original;
    if (v <= 1) return Math.round(original * (1 - v));
    return Math.max(0, original - v);
  };

  const addToCart = (product) => {
    const found = cart.find((c) => c.productCode === product.productCode);
    if (found)
      setCart(
        cart.map((c) =>
          c.productCode === product.productCode
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    else setCart([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (productCode, qty) => {
    if (qty <= 0) return removeFromCart(productCode);
    setCart(
      cart.map((c) =>
        c.productCode === productCode ? { ...c, quantity: qty } : c
      )
    );
  };

  const removeFromCart = (productCode) =>
    setCart(cart.filter((c) => c.productCode !== productCode));
  const clearCart = () => setCart([]);

  const calculateSubtotal = () =>
    cart.reduce((s, it) => s + getDiscountedPrice(it) * it.quantity, 0);
  const calculateTotal = () => calculateSubtotal();
  const getChange = () =>
    Math.max(0, (Number(receivedAmount) || 0) - calculateTotal());

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Giỏ hàng trống!");
    if (paymentMethod === "cash" && getChange() < 0)
      return toast.error("Số tiền nhận không đủ!");
    setIsProcessing(true);
    try {
      const orderData = {
        customerName: customer.name || "Khách lẻ",
        customerPhone: customer.phone || "",
        customerEmail: customer.email || "",
        customerAddress: customer.address || "",
        paymentMethod,
        orderDate: new Date().toISOString(),
        items: cart.map((item) => ({
          productCode: item.productCode,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: getDiscountedPrice(item),
          subtotal: getDiscountedPrice(item) * item.quantity
        })),
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        receivedAmount:
          paymentMethod === "cash" ? Number(receivedAmount) : calculateTotal(),
        change: paymentMethod === "cash" ? getChange() : 0,
        status: "completed"
      };
      const resp = await orderService.createOrder(orderData);
      if (resp && resp.data) {
        const newOrder = {
          ...orderData,
          id: resp.data.id || Date.now(),
          orderCode: resp.data.orderCode || `HD${Date.now()}`
        };
        setLastOrder(newOrder);
        setShowInvoice(true);
        clearCart();
        setCustomer({ name: "", phone: "", email: "", address: "" });
        setReceivedAmount("");
        toast.success("Thanh toán thành công!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra khi thanh toán!");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = (products || []).filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.productName || "").toLowerCase().includes(q) ||
      (p.productCode || "").toLowerCase().includes(q);
    const matchesCategory =
      !selectedCategory || p.categoryCode === selectedCategory;
    // show all products regardless of stock
    const matchesPromotion = !showPromotionsOnly || Boolean(p.promotionCode);
    return matchesSearch && matchesCategory && matchesPromotion;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 m-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
          <aside className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Danh mục</h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setShowPromotionsOnly(false);
                }}
                className={
                  "w-full text-left px-2 py-1 rounded " +
                  (selectedCategory === "" && !showPromotionsOnly
                    ? "bg-blue-100"
                    : "hover:bg-gray-100")
                }
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryCode}
                  onClick={() => {
                    setSelectedCategory(cat.categoryCode);
                    setShowPromotionsOnly(false);
                  }}
                  className={
                    "w-full text-left px-2 py-1 rounded " +
                    (selectedCategory === cat.categoryCode
                      ? "bg-blue-100"
                      : "hover:bg-gray-100")
                  }
                >
                  {cat.categoryName || cat.categoryCode}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Bộ lọc nhanh</h4>
              <button
                onClick={() => setShowPromotionsOnly((s) => !s)}
                className={
                  "w-full text-left px-2 py-2 rounded flex items-center justify-between " +
                  (showPromotionsOnly ? "bg-yellow-100" : "hover:bg-gray-100")
                }
              >
                <span>Chỉ khuyến mãi</span>
                <span className="text-xs text-gray-600">
                  {showPromotionsOnly ? "On" : "Off"}
                </span>
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Hành động</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setShowPromotionsOnly(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => loadProducts()}
                  className="w-full px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Làm mới dữ liệu
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-2 text-sm"
                >
                  <FaTachometerAlt />
                  <span>Quay về Dashboard</span>
                </button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <FaShoppingCart />
                  Bán hàng - Chọn sản phẩm
                </h1>
              </div>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryCode} value={cat.categoryCode}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 h-[calc(100vh-240px)] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => {
                  const originalPrice = Number(product?.price || 0);
                  const discountedPrice = getDiscountedPrice(product);
                  const hasPromotion =
                    product?.promotionCode && discountedPrice < originalPrice;
                  return (
                    <div
                      key={product.productCode}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                        {product.image ? (
                          <img
                            src={normalizeImage(product.image)}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder-book.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBarcode size={24} />
                          </div>
                        )}
                      </div>
                      <h3
                        title={product.productName}
                        className="font-medium text-sm text-gray-900 mb-1 truncate"
                      >
                        {product.productName}
                      </h3>
                      <div className="text-xs text-gray-500 mb-2">
                        Mã: {product.productCode}
                      </div>
                      <div className="space-y-1">
                        {hasPromotion ? (
                          <>
                            <div className="text-xs text-gray-400 line-through">
                              {formatCurrency(originalPrice)}đ
                            </div>
                            <div className="text-sm font-bold text-red-600">
                              {formatCurrency(discountedPrice)}đ
                            </div>
                          </>
                        ) : (
                          <div className="text-sm font-bold text-green-600">
                            {formatCurrency(originalPrice)}đ
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tồn: {product.stock || product.stockQuantity || 0}
                      </div>
                      <button className="w-full mt-2 bg-blue-600 text-white py-1 px-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                        <FaPlus size={10} />
                        Thêm
                      </button>
                    </div>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaBarcode className="mx-auto text-4xl mb-2 opacity-50" />
                  <p>Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white m-4 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="bg-green-600 text-white p-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaShoppingCart />
            Giỏ hàng ({cart.length})
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaShoppingCart className="mx-auto text-4xl mb-2 opacity-50" />
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const price = getDiscountedPrice(item);
                const subtotal = price * item.quantity;
                return (
                  <div
                    key={item.productCode}
                    className="border border-gray-200 rounded p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        title={item.productName}
                        className="font-medium text-sm text-gray-900 truncate flex-1"
                      >
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productCode)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {item.productCode}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productCode, item.quantity - 1)
                          }
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productCode, item.quantity + 1)
                          }
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(subtotal)}đ
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(price)}đ/sp
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}đ</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatCurrency(calculateTotal())}đ
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <FaUser />
                Thông tin khách hàng
              </h3>
              <input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                placeholder="Tên khách hàng"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
              <input
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                placeholder="Số điện thoại"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Phương thức thanh toán</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={
                    "flex-1 px-3 py-2 text-sm rounded flex items-center justify-center gap-1 " +
                    (paymentMethod === "cash"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                  }
                >
                  <FaMoneyBillWave />
                  Tiền mặt
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={
                    "flex-1 px-3 py-2 text-sm rounded flex items-center justify-center gap-1 " +
                    (paymentMethod === "card"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                  }
                >
                  <FaCreditCard />
                  Thẻ
                </button>
              </div>
            </div>
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <input
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  placeholder="Số tiền nhận"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                  type="number"
                />
                {receivedAmount && (
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Tiền thừa:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(getChange())}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={
                  isProcessing || (paymentMethod === "cash" && getChange() < 0)
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaCalculator />
                {isProcessing ? "Đang xử lý..." : "Thanh toán"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={() => setShowInvoice(true)}
                  disabled={!lastOrder}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-1"
                >
                  <FaPrint />
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showInvoice && lastOrder && (
        <InvoiceModal order={lastOrder} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default POSPage;
