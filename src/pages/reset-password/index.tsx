
import { useToast } from "@/hooks/use-toast";
import { verifyResetPasswordSchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ResetPassword = () => {
  
  const router = useRouter();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof verifyResetPasswordSchema>>({
    resolver: zodResolver(verifyResetPasswordSchema),
    defaultValues: {
      code: "",
      confirmPassword: "",
      password: "",
      email: ""
    },
  });
  const onSubmit = async (data: z.infer<typeof verifyResetPasswordSchema>) => {
    try {
      const response = await axios.post("/api/reset-password", {
        email: data.email,
        verifyCode: data.code,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      if (response.data.success) {
        toast({
          title: "Success",
          message: response.data.message,
          variant: "success"
        });
        router.push("/signin");
      } else {
        toast({
          title: "Error",
          message: response.data.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error(error.response.data);
      toast({
        title: "Error",
        message: error.response.data.message,
        variant: "destructive"

      });

    }
  }
  
  return (
    <div className="text-black">
      <h1>Reset Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Email"
          {...form.register("email")}
        />
        <input
          type="text"
          placeholder="Code"
          {...form.register("code")}
        />
        <input
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          {...form.register("confirmPassword")}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )

}

export default ResetPassword;