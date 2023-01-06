import React, { Children } from "react";
import { Navigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const PublicRoute = ({ children }) => {
  const isLogin = useLogin();
  return isLogin ? <Navigate to="/inbox" /> : children;
};

export default PublicRoute;
