import axiosClient from "./axiosClient";

const createItem = async (body) => {
  const result = await axiosClient.post("/cart", body);
  return result;
};

const getAllCart = async (data) => {
  // Accept either a string (customerCode) or an object containing one of several possible keys
  let customerCode = null;
  if (!data) throw new Error("getAllCart requires customer identifier");
  if (typeof data === "string") {
    customerCode = data;
  } else if (typeof data === "object") {
    customerCode =
      data.customerCode ||
      data.userId ||
      data.customer_id ||
      data._id ||
      data.id ||
      data.customerCode;
    // If caller passed a full user object, it may have nested data
    if (!customerCode && data.data) {
      customerCode = data.data.customerCode || data.data._id || data.data.id;
    }
  }

  if (!customerCode) {
    // Fallback: throw so caller can handle or we request without id
    throw new Error("customerCode not found for getAllCart");
  }

  const result = await axiosClient.get(`/cart/${customerCode}`);
  return result;
};

const deleteCart = async (data) => {
  const { customerCode, productCode } = data;
  console.log(data);
  const result = await axiosClient.post(`/cart/${customerCode}/${productCode}`);
  return result;
};

const deleteAllCart = async (customerCode) => {
  console.log(customerCode);
  const result = await axiosClient.post(`/cart/delete-all/${customerCode}`);
  return result;
};

const updateQuantity = async (body) => {
  console.log(body);
  const result = await axiosClient.post("/cart/update-quantity", body);
  return result;
};

export const cartService = {
  createItem,
  getAllCart,
  deleteCart,
  deleteAllCart,
  updateQuantity
};
