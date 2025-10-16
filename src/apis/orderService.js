import axiosClient from "./axiosClient";

const createOrder = async (body) => {
  console.log(body);
  const result = await axiosClient.post("/orders", body);
  return result;
};

export const orderService = {
  createOrder
};
