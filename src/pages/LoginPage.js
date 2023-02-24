import React from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();

  const submit = (data) => {};
  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="input your emial"
            required
            {...register("email")}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="input your emial"
            required
            {...register("passwrord")}
          />
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
