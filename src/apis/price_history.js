import axiosClient from "./axiosClient";

const getAllPriceHistory = async () => {
  const result = await axiosClient.get("/price-histories");
  return result;
};

const getPriceHistoryByImportInvoice = async (invoiceId) => {
  const result = await axiosClient.get(
    `/price-histories/by-import-invoice/${invoiceId}`
  );
  return result;
};

const getPriceHistoryByProductCode = async (productCode) => {
  const result = await axiosClient.get(
    `/price-histories/by-product/${productCode}`
  );
  return result;
};

const getImportInvoicesByProductCode = async (productCode) => {
  const result = await axiosClient.get(
    `/import-invoices/by-product/${productCode}`
  );
  return result;
};

const getPriceHistoryByImportInvoiceCodeAndProductCode = async (
  invoiceCode,
  productCode
) => {
  const result = await axiosClient.get(
    `price-histories/by-import-invoice/${invoiceCode}/${productCode}`
  );
  return result;
};

const createPriceHistory = async (data) => {
  const result = await axiosClient.post(`/price-histories/create`, data);
  return result;
};

const updatePriceHistory = async (id, data) => {
  console.log(id, data);
  const result = await axiosClient.post(`/price-histories/update/${id}`, data);
  console.log(result);
  return result;
};

export const priceHistoryService = {
  getAllPriceHistory,
  getPriceHistoryByImportInvoice,
  getImportInvoicesByProductCode,
  updatePriceHistory,
  getPriceHistoryByProductCode,
  getPriceHistoryByImportInvoiceCodeAndProductCode,
  createPriceHistory
};
