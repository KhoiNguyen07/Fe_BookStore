import axiosClient from "./axiosClient";

const createItem = async (body) => {
  const result = await axiosClient.post("/favorite/create-new", body);
  return result;
};

const getAllFavorite = async (body) => {
  const result = await axiosClient.post("/favorite/get-favorite", body);
  return result;
};

const findOneByProductId = async (body) => {
  const result = await axiosClient.post("/favorite/get-by-productId", body);
  return result;
};

const findOneById = async (body) => {
  const result = await axiosClient.post("/favorite/get-by-id", body);
  return result;
};

const deleteFavorite = async (body) => {
  const result = await axiosClient.delete("/favorite/delete", {
    data: body
  });
  return result;
};

export const favoriteService = {
  createItem,
  getAllFavorite,
  deleteFavorite,
  findOneById,
  findOneByProductId
};
