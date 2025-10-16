import axiosClient from "./axiosClient";

const createNewUser = async (body) => {
  const result = await axiosClient.post("/account/register", body);
  return result;
};

const loginAccount = async (body) => {
  const result = await axiosClient.post("/auth/login", body);
  return result;
};

export const authService = {
  createNewUser,
  loginAccount
};
