import axiosClient from "./axiosClient";

const getAllImportInvoices = async () => {
  const result = await axiosClient.get("/import-invoices");
  return result;
};

const getById = async (id) => {
  const result = await axiosClient.get(`/import-invoices/${id}`);
  return result;
};

const searchImportInvoice = async (value) => {
  const result = await axiosClient.get(`/import-invoices/search?q=${value}`);
  return result;
};

const createImportInvoice = async (data) => {
  console.log(data);
  const result = await axiosClient.post(`/import-invoices/create`, data);
  console.log(result);
  return result;
};

const updateImportInvoice = async (id, data) => {
  const result = await axiosClient.post(`/import-invoices/update/${id}`, data);
  return result;
};

const deleteImportInvoice = async (id) => {
  const result = await axiosClient.post(`/import-invoices/delete/${id}`);
  return result;
};

// Approve import invoice (admin only)
const approveImportInvoice = async (id) => {
  const result = await axiosClient.post(`/import-invoices/approve/${id}`);
  return result;
};

// Reject import invoice (admin only)
const rejectImportInvoice = async (id, rejectReason) => {
  // send reject reason in request body
  const data = { reason: rejectReason };
  console.log(data);
  const result = await axiosClient.post(`/import-invoices/reject/${id}`, data);
  return result;
};

export const importInvoiceService = {
  getAllImportInvoices,
  getById,
  searchImportInvoice,
  createImportInvoice,
  updateImportInvoice,
  deleteImportInvoice,
  approveImportInvoice,
  rejectImportInvoice
};
