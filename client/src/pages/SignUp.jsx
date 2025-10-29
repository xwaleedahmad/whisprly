import { IoKey } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidUser,BiMaleFemale } from "react-icons/bi";

import { useState } from "react";
import { Link } from "react-router-dom";
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';

import Logo from "../components/Logo";
import useSignUp from "../hooks/useSignUp";
import signUpSchema from "../lib/signUpSchema";

const SignUp = () => {
  const [selectedGender, setSelectedGender] = useState("");

  const handleSelectGender = (e) => {
    setSelectedGender(e.target.value);
  };
 
  const {signUp} = useSignUp()

  const {
    register,
    handleSubmit,
    formState : { errors, isSubmitting },
  } = useForm({resolver : zodResolver(signUpSchema)})
  
  const onSubmit = async(data)=>{
    await signUp(data)
  }

  return (
    <div className="w-full min-h-screen flex  justify-center overflow-hidden  ">
      <div className=" w-full  xl:flex xl:flex-col xl:justify-center py-5 pb-12 overflow-hidden background-blur">
        <Logo/>
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-center text-[2rem] font-semibold gradient-text ">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-72 flex flex-col gap-3 mt-10">

            <label className="input input-bordered input-field-styles  flex items-center gap-2">
              <MdEmail />
              <input {...register("email")} onChange={(e) => e.target.value = e.target.value.toLowerCase().replace(/\s/g, '')} type="email" className="auth-btn" name="email"  placeholder="Email" />
            </label>
            {errors.email && (
              <p className="error-msg">{errors.email.message}</p>
            )}
            <label className="input input-bordered flex input-field-styles items-center gap-2">
              <FaUserCircle />
              <input {...register("userName")} onChange={(e) => e.target.value = e.target.value.toLowerCase().replace(/\s/g, '')} type="text" className="auth-btn" name="userName"  placeholder="Username" />
            </label>
            {errors.userName && (
              <p className="error-msg">{errors.userName.message}</p>
            )}
            <label className="input input-bordered flex input-field-styles items-center gap-2">
              <BiSolidUser  />
              <input {...register("fullName")} type="text" className="auth-btn" name="fullName"  placeholder="Full Name" />
            </label>
            {errors.fullName && (
              <p className="error-msg">{errors.fullName.message}</p>
            )}
            <label className="input input-bordered overflow-hidden input-field-styles flex items-center ">
              <BiMaleFemale />
              <select
               {...register("gender")}
               value={selectedGender}
               onChange={handleSelectGender}
               className={`select px-2 !bg-[rgba(29,35,42,0.0)]  capitalize text-base focus:outline-none focus:ring-0 focus:border-0 w-full max-w-xs ${selectedGender === "male" || selectedGender === "female" ? 'auth-btn' : ''}`}
              >
             <option className="input-field-styles" value="" disabled>Gender</option>
             <option className="input-field-styles" value="male">male</option>
             <option className="input-field-styles" value="female">female</option>
           </select>
            </label>
            {errors.gender && (
              <p className="error-msg">{errors.gender.message}</p>
            )}
            <label className="input input-bordered input-field-styles flex items-center gap-2">
              <IoKey />
              <input {...register("password")} type="password" className="auth-btn" name="password"  placeholder="Password" />
            </label>
            {errors.password && (
              <p className="error-msg">{errors.password.message}</p>
            )}
            <label className="input input-bordered input-field-styles flex items-center gap-2">
              <IoKey />
              <input {...register("confirmPassword")} type="password" className="auth-btn " name="confirmPassword"  placeholder="Confirm Password" />
            </label>
            {errors.confirmPassword && (
              <p className="error-msg">{errors.confirmPassword.message}</p>
            )}
            <button
            disabled={isSubmitting}
              type="submit"
              className={`text-white w-72 mt-2 bg-gradient-to-r from-[#863ffa] to-[#3ec0fc] hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-800 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}>
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Register"}
            </button>
          </form>
        <div className="flex items-center mt-1 gap-2 text-sm">
          <p className="capitalize text-gray-400">account already exists ?</p>
          <Link to="/login" className="text-[#3e88cc] hover:underline">Login</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
