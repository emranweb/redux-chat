import React from "react";
import { useSelector } from "react-redux";

const useLogin = () => {
  const userAuth = useSelector((state) => state.auth);

  if (userAuth.accessToken && userAuth.user) {
    return true;
  } else {
    return false;
  }
};

export default useLogin;
