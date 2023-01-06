import React from "react";

import { Navigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const PrivateRoute = ({ children }) => {
  const isLogin = useLogin();

  return isLogin ? children : <Navigate to="/" />;
};

export default PrivateRoute;
