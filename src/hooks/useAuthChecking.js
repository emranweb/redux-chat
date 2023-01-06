import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const useAuthChecking = () => {
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const localStoreageData = localStorage.getItem("auth");
    const localStoreUser = JSON.parse(localStoreageData);
    if (localStoreUser?.accessToken) {
      setAuth(true);
      dispatch(
        userLogin({
          accessToken: localStoreUser.accessToken,
          user: localStoreUser.user,
        })
      );
    }
    setAuth(true);
  }, [dispatch, auth]);
  return { auth };
};

export default useAuthChecking;
