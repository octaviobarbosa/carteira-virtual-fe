export const getToken = () => {
  const appStorage = localStorage.getItem("app");

  const { token } = JSON.parse(appStorage);
  return token;
};
