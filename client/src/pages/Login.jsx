import { IoKey } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
// import { useState,useEffect, useRef } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "../components/Logo";
import useLogin from "../hooks/useLogin";
import loginSchema from "../lib/loginSchema";
// import useSendEmail from "../hooks/useSendEmail";
// import {verificationEmailSchema} from "../lib/resetPasswordSchema"

const Login = () => {
  const { login } = useLogin();
  // const {sendEmail} = useSendEmail()
  // const [showResetDialog, setShowResetDialog] = useState(false);
  // const dialogRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // const {
  //   register : registerEmail,
  //   handleSubmit : handleEmailSubmit,
  //   reset,
  //   formState : {errors:emailErrors,isSubmitting:isEmailSubmitting}
  // }  = useForm({resolver:zodResolver(verificationEmailSchema)})

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dialogRef.current && !dialogRef.current.contains(event.target)) {
  //       setShowResetDialog(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const onSubmit = async (data) => {
    await login(data);
  };

  // const onEmailSubmit = async(data)=>{
  //   await sendEmail(data)
  //   reset()
  //   setShowResetDialog(false)
  // }

  return (
    <>
      <div className="w-full min-h-screen flex  justify-center overflow-hidden  ">
        <div className=" w-full  xl:flex xl:flex-col xl:justify-center py-5 pb-12  overflow-hidden background-blur ">
          <Logo />
          <div className="flex flex-col items-center justify-center mt-40 xl:mt-6 ">
            <h1 className="text-center text-[2.4rem] font-semibold gradient-text ">
              Login
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-72 flex flex-col gap-3 mt-6"
            >
              <label
                htmlFor="email"
                className="input input-bordered input-field-styles  flex items-center gap-2"
              >
                <MdEmail />
                <input
                  {...register("email")}
                  type="text"
                  onChange={(e) =>
                    (e.target.value = e.target.value
                      .toLowerCase()
                      .replace(/\s/g, ""))
                  }
                  id="email"
                  className="auth-btn "
                  placeholder="Email"
                />
              </label>
              {errors.email && (
                <p className="error-msg">{errors.email.message}</p>
              )}
              <label className="input input-bordered input-field-styles flex items-center gap-2">
                <IoKey />
                <input
                  {...register("password")}
                  type="password"
                  className="auth-btn"
                  placeholder="Password"
                />
              </label>
              {errors.password && (
                <p className="error-msg">{errors.password.message}</p>
              )}
              <button
                disabled={isSubmitting}
                type="submit"
                className="text-white w-72 mt-2 bg-gradient-to-r from-[#863ffa] to-[#3ec0fc] hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-800 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="flex items-center mt-2 gap-2 text-sm">
              <p className="capitalize text-gray-400">
                {"Don't"} have account ?
              </p>
              <Link to="/signup" className="text-[#3e88cc] hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Dialog */}
      {/* <div className="fixed bottom-5 right-4">
        <div className="relative">
          {showResetDialog && (
            <div 
              ref={dialogRef}
              className="absolute bottom-16 right-0 bg-primary border border-gray-700 rounded-lg shadow-lg p-4 w-96"
            >
              <h3 className="text-lg font-semibold mb-2 text-white">Reset Password</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter your email to receive reset instructions
              </p>
              <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <label htmlFor="email" className="input input-bordered  text-gray-400 border border-gray-700 bg-primary mb-2  flex items-center gap-2">
                <MdEmail />
                <input
                {...registerEmail("email")}
                  type="text"
                  className="auth-btn"
                  onChange={(e) => e.target.value = e.target.value.toLowerCase().replace(/\s/g, '')}
                  placeholder="Email"
                />
              </label>
              {emailErrors.email && 
              <p className="error-msg">{emailErrors.email.message}</p>}
              <div className="flex justify-end mt-3 gap-2">
                <button
                  onClick={() => setShowResetDialog(false)}
                  className="px-4 py-2 w-full text-sm bg-quaternary rounded-lg text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
                <button  type="submit"
                disabled={isEmailSubmitting}
                  className="px-4 py-2 w-full text-sm text-white rounded-lg bg-gradient-to-r from-[#863ffa] to-[#3ec0fc]  hover:opacity-80"
                >
                   {isEmailSubmitting ? <span className="loading loading-xs loading-spinner"></span> : "Send"}
                </button>
              </div>
              </form>
            </div>
          )}
          <button
            onClick={() => setShowResetDialog(!showResetDialog)}
            className="bg-gradient-to-r from-[#863ffa] to-[#3ec0fc] p-3 rounded-full  shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </button>
        </div>
      </div> */}
    </>
  );
};

export default Login;
