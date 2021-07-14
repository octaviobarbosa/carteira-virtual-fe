export const getToken = () => {
  const appStorage = localStorage.getItem("app");

  let token = "";

  if (appStorage) {
    token = JSON.parse(appStorage).token;
  }
  return token;
};
