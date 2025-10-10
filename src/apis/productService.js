import axiosClient from "./axiosClient";

const getById = async (id) => {
  const result = await axiosClient.get(`/product/${id}`);
  return result;
};

const getAllProduct = async () => {
  const result = await axiosClient.get("/product");
  return result;
};

const searchProduct = async (body) => {
  const result = await axiosClient.post("/product/search", body);
  return result;
};

export const productService = {
  getAllProduct,
  getById,
  searchProduct
};
