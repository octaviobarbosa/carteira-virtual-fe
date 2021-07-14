import { useEffect, useState } from "react";

const useApp = () => {
  const [app, setApp] = useState({});

  useEffect(() => {
    setApp(getAppData);
  }, [setApp]);

  const getAppData = () => {
    const appStorage = localStorage.getItem("app");

    if (appStorage) {
      return JSON.parse(appStorage);
    }

    return null;
  };

  const setAppData = (data) => {
    const newApp = { ...app, ...data };

    localStorage.setItem("app", JSON.stringify(newApp));
    setApp(newApp);
  };

  const getToken = () => {
    const appStorage = localStorage.getItem("app");

    const { token } = JSON.parse(appStorage);

    return token;
  };

  return { getAppData, setAppData, getToken };
};

export default useApp;
