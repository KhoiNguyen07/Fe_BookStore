import axiosClient from "./axiosClient";

const createItem = async (body) => {
  const result = await axiosClient.post("/cart/create-new", body);
  return result;
};

const getAllCart = async (body) => {
  const result = await axiosClient.post("/cart/get-cart", body);
  return result;
};

const deleteCart = async (body) => {
  const result = await axiosClient.delete("/cart/delete-cart", {
    data: body
  });
  return result;
};

const deleteAllCart = async () => {
  const result = await axiosClient.delete("/cart/delete-all-cart");
  return result;
};

const updateQuantity = async (body) => {
  const result = await axiosClient.put("/cart/update-quantity", body);
  return result;
};

export const cartService = {
  createItem,
  getAllCart,
  deleteCart,
  deleteAllCart,
  updateQuantity
};
