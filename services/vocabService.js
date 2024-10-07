import { instance } from "./authService";

export const fetchVocab = async (id) => {
  const { data } = await instance.get(`/vocab/${id}`);
  return data;
};
