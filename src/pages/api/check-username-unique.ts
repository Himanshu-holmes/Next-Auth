import prisma from "@/lib/prisma";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username:usernameValidation
});

export default async function handler(request: NextApiRequest,response:NextApiResponse) {
    try {
          if (request.method !== "GET") {
            // Respond with a 405 Method Not Allowed if it's not a POST request
            return response.status(405).json({
              success: false,
              message: `Method ${request.method} Not Allowed`,
            });
          }
          const {searchParams} = new URL(request.url || "", "http://localhost");
          const queryParam = {
            username:searchParams.get("username")
          }

        const result =  UsernameQuerySchema.safeParse(queryParam);
        console.log('result',result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return response.status(400).json({success:false,message:usernameErrors});
        };

        const {username} = result.data;
        const existingUser = await prisma.user.findUnique({
            where:{
                username
            }
        });
        if(existingUser){
            return response.status(400).json({success:false,message:"Username already exists"});
        }
        return response.status(200).json({success:true,message:"Username is unique"});

    } catch (error) {
        console.log(error);
        return response.status(400).json({success:false,message:"Something went wrong"});
    }
}