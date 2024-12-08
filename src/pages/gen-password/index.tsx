import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyGenResPasswordSchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const GenResetPassword = () => {
 
  const router = useRouter();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof verifyGenResPasswordSchema>>({
    resolver: zodResolver(verifyGenResPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof verifyGenResPasswordSchema>) => {
    try {
      const response = await axios.post("/api/gen-reset-password", {
       email: data.email,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          message: response.data.message,
          variant: "success",
        });
        router.replace("/reset-password");
      } else {
        toast({
          title: "Error",
          message: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error.response.data);
      toast({
        title: "Error",
        message: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1>Generate reset Password Otp</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default GenResetPassword