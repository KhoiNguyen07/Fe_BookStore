import React, { useState } from "react";
import AdminLayout from "~/components/Admin/AdminLayout";
import Table from "~/components/Admin/Table";
import Modal from "~/components/Admin/Modal";
import SearchBar from "~/components/Admin/SearchBar";
import Pagination from "~/components/Admin/Pagination";
import { FaPlus, FaTags, FaPercent } from "react-icons/fa";

const CustomerTypesPage = () => {
  const [customerTypes, setCustomerTypes] = useState([
    {
      id: 1,
      name: "VIP",
      description: "VIP customers with special benefits",
      discountPercent: 15,
      minPoints: 1000,
      status: "Active",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Gold",
      description: "Gold tier customers",
      discountPercent: 10,
      minPoints: 500,
      status: "Active",
      createdAt: "2024-01-02"
    },
    {
      id: 3,
      name: "Silver",
      description: "Silver tier customers",
      discountPercent: 5,
      minPoints: 100,
      status: "Active",
      createdAt: "2024-01-03"
    },
    {
      id: 4,
      name: "Regular",
      description: "Regular customers",
      discountPercent: 0,
      minPoints: 0,
      status: "Active",
      createdAt: "2024-01-04"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountPercent: 0,
    minPoints: 0,
    status: "Active"
  });

  const itemsPerPage = 10;

  // Filter and sort data
  const filteredTypes = customerTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTypes = [...filteredTypes].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTypes = sortedTypes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc"
    }));
  };

  const openCreateModal = () => {
    setEditingType(null);
    setFormData({
      name: "",
      description: "",
      discountPercent: 0,
      minPoints: 0,
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (type) => {
    setEditingType(type);
    setFormData({ ...type });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingType) {
      setCustomerTypes((prev) =>
        prev.map((type) =>
          type.id === editingType.id
            ? { ...formData, id: editingType.id }
            : type
        )
      );
    } else {
      const newType = {
        ...formData,
        id: Math.max(...customerTypes.map((t) => t.id), 0) + 1,
        createdAt: new Date().toISOString().split("T")[0]
      };
      setCustomerTypes((prev) => [...prev, newType]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (type) => {
    if (
      window.confirm(
        `Are you sure you want to delete customer type "${type.name}"?`
      )
    ) {
      setCustomerTypes((prev) => prev.filter((t) => t.id !== type.id));
    }
  };

  const columns = [
    {
      key: "name",
      title: "Type Name",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FaTags className="text-purple-500 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: "description", title: "Description", sortable: true },
    {
      key: "discountPercent",
      title: "Discount %",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FaPercent className="text-green-500 mr-1 text-xs" />
          <span className="font-medium text-green-600">{value}%</span>
        </div>
      )
    },
    {
      key: "minPoints",
      title: "Min Points",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">
          {value.toLocaleString()}
        </span>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      )
    },
    { key: "createdAt", title: "Created At", sortable: true }
  ];

  const actions = {
    edit: openEditModal,
    delete: handleDelete
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Types</h1>
            <p className="text-gray-600">Manage customer tiers and benefits</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus />
            <span>Add Customer Type</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search customer types..."
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            columns={columns}
            data={paginatedTypes}
            actions={actions}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? "Edit Customer Type" : "Create New Customer Type"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer type name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountPercent: parseInt(e.target.value) || 0
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Points *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.minPoints}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minPoints: parseInt(e.target.value) || 0
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {editingType ? "Update Type" : "Create Type"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default CustomerTypesPage;
