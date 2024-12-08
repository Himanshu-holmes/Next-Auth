import { z } from "zod";

export const emailValidation = z.string().email({
    message: "Invalid email address",
});

export const usernameValidation = z.string().min(3,"username atleast of 3 char")
.max(10,"username cannot be more than 20 character")


export const signUpSchema = z.object({
    username:usernameValidation,
    email: emailValidation,
    password: z.string().min(5),

})