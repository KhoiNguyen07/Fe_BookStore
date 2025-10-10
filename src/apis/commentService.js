import axiosClient from "./axiosClient";

const createNew = async (body) => {
  const result = await axiosClient.post("/comment/create-new", body);
  return result;
};

const findAllCommentByProductId = async (id) => {
  const result = await axiosClient.get(
    `/comment/findAllCommentByProductId/${id}`
  );
  return result;
};

const deleteComment = async (body) => {
  const result = await axiosClient.delete("/comment/deleteCommentById", {
    data: body
  });
  return result;
};

export const commentService = {
  createNew,
  findAllCommentByProductId,
  deleteComment
};
