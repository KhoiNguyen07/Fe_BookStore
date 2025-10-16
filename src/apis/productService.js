import { ClockFading } from "lucide-react";
import axiosClient from "./axiosClient";

const getById = async (id) => {
  const result = await axiosClient.get(`/products/${id}`);
  return result;
};

const getAllProduct = async () => {
  const result = await axiosClient.get("/products");
  return result;
};

const searchProduct = async (value) => {
  const result = await axiosClient.get(`/products/search?q=${value}`);
  return result;
};

const createProduct = async (data) => {
  const result = await axiosClient.post(`/products/create`, data);
  return result;
};

const updateProduct = async (id, data) => {
  console.log(id, data);
  const result = await axiosClient.post(`/products/update/${id}`, data);
  return result;
};

const deleteProduct = async (id) => {
  console.log(id);
  // Ensure we send the canonical productCode in the request body.
  // Some backends accept POST /products/delete with { productCode } while
  // others accept POST /products/delete/:id — try body first and fallback.
  try {
    const result = await axiosClient.post(`/products/delete`, {
      productCode: id
    });
    return result;
  } catch (err) {
    // fallback to previous behavior
    return axiosClient.post(`/products/delete/${id}`);
  }
};

// Pricing-specific methods
const updateProductPrice = async (productCode, priceData) => {
  const result = await axiosClient.post(
    `/products/update-price/${productCode}`,
    priceData
  );
  return result;
};

const getPriceHistory = async (productCode) => {
  const result = await axiosClient.get(
    `/products/${productCode}/price-history`
  );
  return result;
};

const getAllPriceHistory = async (params = {}) => {
  const result = await axiosClient.get("/products/price-history", { params });
  return result;
};

const bulkUpdatePrices = async (updates) => {
  const result = await axiosClient.post(`/products/bulk-update-prices`, {
    updates
  });
  return result;
};

export const productService = {
  getAllProduct,
  getById,
  searchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductPrice,
  getPriceHistory,
  getAllPriceHistory,
  bulkUpdatePrices
};
