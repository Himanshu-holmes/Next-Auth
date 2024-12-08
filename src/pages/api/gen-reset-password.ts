import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
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
        const {email} = request.body;
        console.log("email",email);
        // search email in db
        let user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user) {
            return response.status(400).json({success:false,message:"User not found"});
        }
         const verificationCode = Math.floor(
           100000 + Math.random() * 900000
         ).toString();
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1);
      let getRes =  await prisma.resetPassword.upsert({
            where:{
                userId:user.id
            },
            update:{
                verifyCode:verificationCode
            },
            create:{
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                user: { connect: { id: user.id } },
            }
        });

        console.log("getRes",getRes);

      let emailResponse =  await sendVerificationEmail(email, verificationCode,"Reset your password");
      if(emailResponse.success) {
          return response.status(200).json({success:true,message:"Email sent successfully"});
      } else {
            return response.status(400).json({success:false,message:"Failed to send email"});
        }
         

    } catch (error) {
        console.log(error);
        return response.status(400).json({success:false,message:"Something went wrong"});
        
    }
}