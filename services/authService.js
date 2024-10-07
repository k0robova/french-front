import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://192.168.43.163:2023",
  baseURL: "http://192.168.1.193:2023",
});

export const setToken = (token) => {
  instance.defaults.headers.common["Authorization"] = token;
};

export const deleteToken = () => {
  instance.defaults.headers.common.Authorization = "";
};

export const singUp = async (formData) => {
  const { data } = await instance.post("/users/register", formData);
  setToken(`Bearer ${data.token}`);
  return data;
};

export const logIn = async (body) => {
  const { data } = await instance.post("/users/login", body);

  setToken(`Bearer ${data.token}`);
  return data;
};

export const logout = async () => {
  try {
    await instance.post("/users/logout");
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async () => {
  const { data } = await instance.get("/users/current", {
    headers: {
      "Cache-Control": "no-cache", // Вимикаємо кешування
      Pragma: "no-cache", // Для деяких старих браузерів
      Expires: "0", // Вказує, що відповідь вже не є актуальною
    },
  });
  return data;
};

export const updateUser = async (body) => {
  const { data } = await instance.put("/users/update", body);
  return data;
};

export const updatePassword = async (body) => {
  await instance.patch("/users/updatePassword", body);
  return;
};

export const verify = async () => {
  const data = await instance.post("/users/verify");
  return data;
};

export const updateTheme = async (body) => {
  const { data } = await instance.patch("/users/theme", body);
  return data;
};

export const updateLng = async (body) => {
  const { data } = await instance.patch("/users/lng".body);
  return data;
};

export const forgotPass = async (body) => {
  const data = await instance.post("/users/forgotPassword", body);
  return data;
};

export const restorePassword = async (otp, body) => {
  const data = await instance.post(`/users/restorePassword/${otp}`, body);
  return data;
};
