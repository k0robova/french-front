import { instance } from "./authService";

export const fetchVocab = async () => {
  const { data } = await instance.get("/vocab");
  return data;
};
