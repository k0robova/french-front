export const createFormDataRegister = (body) => {
  const formData = new FormData();
  formData.append("name", body.name);
  formData.append("dateOfBirth", body.dateOfBirth);
  formData.append("email", body.email);
  formData.append("password", body.password);

  return formData;
};
