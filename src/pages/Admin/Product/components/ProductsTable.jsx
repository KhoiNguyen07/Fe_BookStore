import React from "react";
import { FaBook, FaStar, FaEdit, FaTrash } from "react-icons/fa";

const ProductsTable = ({
  paginatedData,
  normalizeImage,
  formatCurrency,
  handleEditProduct,
  handleDeleteProduct
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá nhập
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((product) => (
              <tr key={product.productCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {product.image ? (
                        <img
                          src={normalizeImage(product.image)}
                          alt={product.productName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FaBook className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.productCode}
                      </div>
                      {product.author && (
                        <div className="text-xs text-gray-400">
                          {product.author}
                        </div>
                      )}
                      {product.publisher && (
                        <div className="text-xs text-gray-400">
                          NXB: {product.publisher}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {product.categoryName || "Chưa phân loại"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(product.price)}đ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {product.importPrice != null
                      ? `${formatCurrency(product.importPrice)}đ`
                      : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      (product.stock || 0) > 10
                        ? "bg-green-100 text-green-800"
                        : (product.stock || 0) > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.rating ? (
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-gray-400">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productCode)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
