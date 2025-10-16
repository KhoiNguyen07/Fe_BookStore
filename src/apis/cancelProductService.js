import { ClockFading } from "lucide-react";
import axiosClient from "./axiosClient";

const createCancelProduct = async (data) => {
  const result = await axiosClient.post(`/cancelled-products/create`, data);
  console.log(result);
  return result;
};
const getAllCancelProducts = async () => {
  const result = await axiosClient.get("/cancelled-products");
  return result;
};
const getCancelProductImportDetailCode = async (importDetailCode) => {
  console.log(importDetailCode);
  const result = await axiosClient.get(
    `/cancel-products/by-import-invoice-detail/${importDetailCode}`
  );
  return result;
};

export const cancelProductService = {
  createCancelProduct,
  getAllCancelProducts,
  getCancelProductImportDetailCode
};
