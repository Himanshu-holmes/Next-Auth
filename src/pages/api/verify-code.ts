import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(request: NextApiRequest,response:NextApiResponse) {
  try {
    if (request.method !== "POST") {
      // Respond with a 405 Method Not Allowed if it's not a POST request
      return response.status(405).json({
        success: false,
        message: `Method ${request.method} Not Allowed`,
      });
    }
   const {username, code} = request.body;
   const decodedUsername = decodeURIComponent(username);
   const user = await prisma.user.findUnique({
        where:{
        username:decodedUsername
        }
    });
    if(!user) {
        return response.status(400).json({success:false,message:"User not found"});
    }
    if(user.verifyCode !== code) {
        return response.status(400).json({success:false,message:"Invalid code"});
    }
    const currentDate = new Date();
    if(currentDate > user.verifyCodeExpiry) {
        return response.status(400).json({success:false,message:"Code expired"});
    }
    await prisma.user.update({
        where:{
            username:decodedUsername
        },
        data:{
            isVerified:true
        }
    });
    return response.status(200).json({success:true,message:"User verified successfully"});
  } catch (error) {
    console.log(error);
    return response.status(400).json({success:false,message:"Something went wrong"});
    
  }
}