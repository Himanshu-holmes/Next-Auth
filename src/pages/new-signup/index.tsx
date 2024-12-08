import { useForm } from "react-hook-form";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMesssage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    let debounced = useDebounceCallback(setUsername, 300)

    const { toast } = useToast();
    const router = useRouter();
    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    useEffect(() => {
        const checkUsername = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                  console.error(error.response.data);
                  setUsernameMessage(error.response.data.message)
                } finally { 
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsername();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true);
        try {
        const response =  await axios.post<ApiResponse>('/api/sign-up',data);
        if(response.data.success) {
            toast({
                title:"Account created",
                description:"You can now sign in",
               
            });
            // router.push('/signin');
        } else {
            toast({
                title:"Error",
                description:response.data.message,
            
            });
            return;
        }
        router.replace(`/verify/${username}`);
        setIsSubmitting(false);

        } catch (error) {
            toast({
                title:"Error",
                description:"Something went wrong",
                variant:"destructive"
            });
            setIsSubmitting(false);
            console.log(error);

        } finally{
            setIsSubmitting(false);
        }
        
    }
    return (
      <div className="mt-10 w-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                  
                      {isCheckingUsername ? (
                        <Loader2 className="h-4 w-4 animate-spin" /> ): usernameMesssage
                      }
                       {/* <p className={`text-sm `}>{usernameMesssage}</p> */}
                   
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} type="password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>Already a account? </p>
          <Link href="/sign-in">sign in</Link>
        </div>
      </div>
    );

}
export default page;