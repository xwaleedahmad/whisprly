import { z } from "zod";

const signUpSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address")
      .transform((val) => val.toLowerCase().trim().replace(/\s+/g, "")),
    userName: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be atleast 3 characters long")
      .transform((val) => val.toLowerCase().trim().replace(/\s+/g, "")),
    fullName: z
      .string()
      .nonempty("Full name is required")
      .min(3, "Fullname must be atleast 3 characters long"),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be 6+ characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signUpSchema;
