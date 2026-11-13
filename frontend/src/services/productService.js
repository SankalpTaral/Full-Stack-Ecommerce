import api from "./api";


export const getProducts = async (limit = undefined) => {
  const response = await api.get("/products", {
    params: limit ? { limit } : {}
  });

  return response.data;
};


export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};