import axiosClient from "./axiosClient";

// Create a favorite item. Accepts either legacy body or { customerCode, productCode }
const createItem = async (body) => {
  // prefer POST /favorite with { customerCode, productCode }
  try {
    const result = await axiosClient.post("/favorite", body);
    return result;
  } catch (err) {
    // fallback to legacy endpoint
    return axiosClient.post("/favorite/create-new", body);
  }
};

// Get all favorites for a customer. Try GET /favorite/:customerCode, fallback to POST /favorite/get-favorite
const getAllFavorite = async (data) => {
  let customerCode = null;
  if (!data) throw new Error("getAllFavorite requires customer identifier");
  if (typeof data === "string") {
    customerCode = data;
  } else if (typeof data === "object") {
    customerCode =
      data.customerCode ||
      data.userId ||
      data.customer_id ||
      data._id ||
      data.id;
    if (!customerCode && data.data) {
      customerCode = data.data.customerCode || data.data._id || data.data.id;
    }
  }

  if (!customerCode)
    throw new Error("customerCode not found for getAllFavorite");

  try {
    const result = await axiosClient.get(`/favorite/${customerCode}`);
    return result;
  } catch (err) {
    // fallback to legacy POST
    return axiosClient.post("/favorite/get-favorite", { customerCode });
  }
};

// Delete favorite: single POST endpoint /favorite/:customerCode/:productCode
// This function expects { customerCode, productCode } and will POST to that path.
const deleteFavorite = async (body) => {
  const { customerCode, productCode } = body || {};
  if (!customerCode || !productCode) {
    throw new Error("deleteFavorite requires { customerCode, productCode }");
  }

  // backend expects POST to /favorite/:customerCode/:productCode to delete
  return axiosClient.post(`/favorite/${customerCode}/${productCode}`);
};

export const favoriteService = {
  createItem,
  deleteFavorite,
  getAllFavorite
};
