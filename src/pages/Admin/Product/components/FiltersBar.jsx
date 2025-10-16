import React from "react";
import { FaSearch } from "react-icons/fa";

const FiltersBar = ({
  searchTerm,
  setSearchTerm,
  categories,
  filterCategory,
  setFilterCategory,
  priceRange,
  setPriceRange,
  sortConfig,
  setSortConfig,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search */}
        <div className="lg:col-span-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, mã, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.categoryCode} value={category.categoryCode}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="lg:col-span-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Giá từ"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Giá đến"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="lg:col-span-2">
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key, direction });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="productName-asc">Tên A→Z</option>
            <option value="productName-desc">Tên Z→A</option>
            <option value="price-asc">Giá thấp→cao</option>
            <option value="price-desc">Giá cao→thấp</option>
            <option value="stock-desc">Tồn kho nhiều→ít</option>
            <option value="productCode-asc">Mã sản phẩm</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="lg:col-span-1">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
