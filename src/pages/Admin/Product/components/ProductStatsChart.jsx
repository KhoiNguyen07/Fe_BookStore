import React from "react";

const BAR_COLORS = {
  total: "bg-gray-300",
  inStock: "bg-green-500",
  outOfStock: "bg-red-500",
  lowStock: "bg-yellow-500"
};

const StatBar = ({ label, value, total, colorClass }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 text-sm text-gray-700">{label}</div>
      <div className="flex-1">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className={`${colorClass} h-3`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="w-28 text-right text-sm text-gray-700">
        {value} ({pct}%)
      </div>
    </div>
  );
};

const ProductStatsChart = ({ counts = {} }) => {
  const total = counts.total || 0;
  const inStock = counts.inStock || 0;
  const outOfStock = counts.outOfStock || 0;
  const lowStock = counts.lowStock || 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thống kê sản phẩm</h3>
        <div className="text-sm text-gray-500">
          Tổng: <span className="font-medium text-gray-800">{total}</span>
        </div>
      </div>

      <div className="space-y-3">
        <StatBar
          label="Sản phẩm còn hàng"
          value={inStock}
          total={total}
          colorClass={BAR_COLORS.inStock}
        />
        <StatBar
          label="Sản phẩm hết hàng"
          value={outOfStock}
          total={total}
          colorClass={BAR_COLORS.outOfStock}
        />
        <StatBar
          label="Sắp hết hàng (<5)"
          value={lowStock}
          total={total}
          colorClass={BAR_COLORS.lowStock}
        />
      </div>
    </div>
  );
};

export default ProductStatsChart;
