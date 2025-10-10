import axiosClient from "./axiosClient";

const createNewUser = async (body) => {
  const result = await axiosClient.post("/user/signup", body);
  return result;
};

const loginAccount = async (body) => {
  const result = await axiosClient.post("/user/login", body);
  return result;
};

export const authService = {
  createNewUser,
  loginAccount
};
