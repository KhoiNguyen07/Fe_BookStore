import axiosClient from "./axiosClient";

const getAllCategory = async () => {
  const result = await axiosClient.get("/categories");
  return result;
};

export const categoryService = {
  getAllCategory
};
