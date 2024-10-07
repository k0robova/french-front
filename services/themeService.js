import { instance } from "./authService";

export const fetchTopic = async () => {
  const { data } = await instance.get("/theme");

  return data;
};
