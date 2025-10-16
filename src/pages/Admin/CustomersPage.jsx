import React, { useState } from "react";
import AdminLayout from "~/components/Admin/AdminLayout";
import Table from "~/components/Admin/Table";
import Modal from "~/components/Admin/Modal";
import SearchBar from "~/components/Admin/SearchBar";
import Pagination from "~/components/Admin/Pagination";
import { FaPlus, FaUser, FaStar, FaEnvelope, FaPhone } from "react-icons/fa";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+1-555-0123",
      customerType: "VIP",
      loyaltyPoints: 1250,
      totalOrders: 15,
      totalSpent: 2500.0,
      status: "Active",
      joinDate: "2023-06-15",
      lastOrderDate: "2024-01-10"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      phone: "+1-555-0124",
      customerType: "Gold",
      loyaltyPoints: 750,
      totalOrders: 8,
      totalSpent: 1200.0,
      status: "Active",
      joinDate: "2023-08-20",
      lastOrderDate: "2024-01-12"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@gmail.com",
      phone: "+1-555-0125",
      customerType: "Silver",
      loyaltyPoints: 320,
      totalOrders: 5,
      totalSpent: 650.0,
      status: "Active",
      joinDate: "2023-10-05",
      lastOrderDate: "2024-01-08"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@gmail.com",
      phone: "+1-555-0126",
      customerType: "Regular",
      loyaltyPoints: 50,
      totalOrders: 2,
      totalSpent: 125.0,
      status: "Inactive",
      joinDate: "2023-12-01",
      lastOrderDate: "2023-12-15"
    }
  ]);

  const [customerTypes] = useState([
    { id: 1, name: "VIP" },
    { id: 2, name: "Gold" },
    { id: 3, name: "Silver" },
    { id: 4, name: "Regular" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: "",
    status: "Active"
  });

  const itemsPerPage = 10;

  // Filter and sort data
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || customer.customerType === filterType;
    const matchesStatus = !filterStatus || customer.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(
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
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      customerType: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      customerType: customer.customerType,
      status: customer.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                customerType: formData.customerType,
                status: formData.status
              }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: Math.max(...customers.map((c) => c.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        customerType: formData.customerType,
        loyaltyPoints: 0,
        totalOrders: 0,
        totalSpent: 0,
        status: formData.status,
        joinDate: new Date().toISOString().split("T")[0],
        lastOrderDate: "Never"
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete customer "${customer.name}"?`
      )
    ) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Regular":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "name",
      title: "Customer Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="flex items-center">
            <FaUser className="text-blue-500 mr-2" />
            <span className="font-medium">{value}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <FaEnvelope className="mr-1" />
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: "phone",
      title: "Phone",
      render: (value) => (
        <div className="flex items-center">
          <FaPhone className="text-green-500 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: "customerType",
      title: "Type",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(
            value
          )}`}
        >
          {value}
        </span>
      )
    },
    {
      key: "loyaltyPoints",
      title: "Loyalty Points",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-medium text-yellow-600">
            {value.toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: "totalOrders",
      title: "Orders",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: "totalSpent",
      title: "Total Spent",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-green-600">${value.toFixed(2)}</span>
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
    { key: "joinDate", title: "Join Date", sortable: true }
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
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">
              Manage customer accounts and loyalty
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search customers..."
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {customerTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            columns={columns}
            data={paginatedCustomers}
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
        title={editingCustomer ? "Edit Customer" : "Create New Customer"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type *
            </label>
            <select
              required
              value={formData.customerType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerType: e.target.value
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select customer type</option>
              {customerTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
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
              {editingCustomer ? "Update Customer" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default CustomersPage;
