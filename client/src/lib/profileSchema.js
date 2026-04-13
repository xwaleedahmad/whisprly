import {z} from "zod"

export const profileAccountSchema = z.object({
    newEmail: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase().trim().replace(/\s+/g, "")),
  newUserName: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .transform((val) => val.toLowerCase().trim().replace(/\s+/g, "")),
  newFullName: z
    .string()
    .min(3, "Fullname must be atleast 3 characters long"),
})

export const profilePasswordSchema = z.object({
   oldPassword: z
    .string()
    .nonempty("Old Password is required"),
   newPassword: z
    .string()
    .nonempty("Plese enter new password")
    .min(6, "Password must be 6+ characters"),
  confirmNewPassword: z.string().nonempty("Confirm password is required"),
}).refine((data)=> data.newPassword === data.confirmNewPassword,{
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
})
