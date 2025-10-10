import axiosClient from "./axiosClient";

const findOneByOrderId = async (body) => {
  const result = await axiosClient.post(
    "/historyTransfer/find-one-by-orderId",
    body
  );
  return result;
};

export const historyTransferService = {
  findOneByOrderId
};
