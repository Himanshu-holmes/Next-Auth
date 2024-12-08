import { z } from "zod";
import { emailValidation } from "./signUpSchema";

export const verifySchema = z.object({
    code:z.string().length(6,"Verification code must be 6 characters long"),
})

export const verifyResetPasswordSchema = z.object({
    email:emailValidation,
    code:z.string().length(6,"Verification code must be 6 characters long"),
    password:z.string().min(5,"Password must be at least 8 characters long"),
    confirmPassword:z.string().min(5,"Password must be at least 8 characters long"),
})

export const verifyGenResPasswordSchema = z.object({
    email:emailValidation})