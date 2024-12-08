import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import  * as z  from "zod";

const VerifyAccount = () => {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
     code:"",
    },
  });
const onSubmit = async (data: z.infer<typeof verifySchema>) => {
   try {
    const response =  await axios.post("/api/verify-code",{
        username:params.username,
        code:data.code
    });
    if(response.data.success) {
        toast({
            title:"Success",
            message:response.data.message,
            variant:"success"
        });
        router.push("/signin");
    }else {
        toast({
            title:"Error",
            message:response.data.message,
            variant:"destructive"
        });
    }
   } catch (error : any) {
     console.error(error.response.data);
     toast({
       title: "Error",
       message: error.response.data.message,
       variant: "destructive"
       
     });
    
   }
}
  console.log("params", params);
  return (
    <div>
      <h1>Verifying {params?.username}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="code" {...field} />
                </FormControl>
                <FormDescription>
                 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default VerifyAccount;