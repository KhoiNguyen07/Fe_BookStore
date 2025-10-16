import axiosClient from "./axiosClient";

const createNewUser = async (body) => {
  console.log(body);
  const result = await axiosClient.post("/account/register", body);
  return result;
};

const loginAccount = async (body) => {
  console.log(body);
  const result = await axiosClient.post("/auth/login", body);
  return result;
};

export const authService = {
  createNewUser,
  loginAccount
};
