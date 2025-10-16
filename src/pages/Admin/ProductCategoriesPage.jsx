import React, { useState } from "react";
import AdminLayout from "~/components/Admin/AdminLayout";
import Table from "~/components/Admin/Table";
import Modal from "~/components/Admin/Modal";
import SearchBar from "~/components/Admin/SearchBar";
import Pagination from "~/components/Admin/Pagination";
import { FaPlus, FaLayerGroup } from "react-icons/fa";

const ProductCategoriesPage = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Fiction",
      description: "Fiction books and novels",
      slug: "fiction",
      productsCount: 145,
      status: "Active",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Non-Fiction",
      description: "Non-fiction books",
      slug: "non-fiction",
      productsCount: 89,
      status: "Active",
      createdAt: "2024-01-02"
    },
    {
      id: 3,
      name: "Science & Technology",
      description: "Science and technology books",
      slug: "science-technology",
      productsCount: 67,
      status: "Active",
      createdAt: "2024-01-03"
    },
    {
      id: 4,
      name: "Children's Books",
      description: "Books for children",
      slug: "childrens-books",
      productsCount: 123,
      status: "Active",
      createdAt: "2024-01-04"
    },
    {
      id: 5,
      name: "Academic",
      description: "Academic and educational books",
      slug: "academic",
      productsCount: 78,
      status: "Inactive",
      createdAt: "2024-01-05"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    status: "Active"
  });

  const itemsPerPage = 10;

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Filter and sort data
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || category.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = sortedCategories.slice(
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
    setEditingCategory(null);
    setFormData({ name: "", description: "", slug: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      status: category.status
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: formData.name,
                description: formData.description,
                slug: formData.slug,
                status: formData.status
              }
            : category
        )
      );
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        productsCount: 0,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0]
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (category) => {
    if (category.productsCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it has ${category.productsCount} products.`
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete category "${category.name}"?`
      )
    ) {
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    }
  };

  const columns = [
    {
      key: "name",
      title: "Category Name",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FaLayerGroup className="text-blue-500 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: "description", title: "Description", sortable: true },
    {
      key: "slug",
      title: "Slug",
      render: (value) => (
        <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
          {value}
        </code>
      )
    },
    {
      key: "productsCount",
      title: "Products",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">{value}</span>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Product Categories
            </h1>
            <p className="text-gray-600">
              Manage product categories and organization
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search categories..."
              />
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
            data={paginatedCategories}
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
        title={editingCategory ? "Edit Category" : "Create New Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="category-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the name. Auto-generated from name.
            </p>
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
              placeholder="Enter category description"
            />
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
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ProductCategoriesPage;
