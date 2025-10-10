import axiosClient from "./axiosClient";

const createOrder = async (body) => {
  const result = await axiosClient.post("/order/create-new", body);
  return result;
};

const findOneById = async (body) => {
  const result = await axiosClient.post("/order/get-order-by-id", body);
  return result;
};

const findOneByUserId = async (body) => {
  const result = await axiosClient.post("/order/get-order-by-userId", body);
  return result;
};

const updateStatusByOrderId = async (body) => {
  const result = await axiosClient.post("/order/update-status-by-id", body);
  return result;
};

export const orderService = {
  createOrder,
  findOneById,
  findOneByUserId,
  updateStatusByOrderId
};
