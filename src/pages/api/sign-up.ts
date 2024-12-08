import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';


import { sendVerificationEmail } from '@/utils/sendVerificationEmail';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest,response:NextApiResponse) {
  try {
    const { email, password,username } = await request.body;
    const existingUserVerifiedByEmail = await prisma.user.findUnique({
      where: {
        email,
        username,
        isVerified: true,
      },
    });
    if (existingUserVerifiedByEmail) {
      return response.status(400).json(
        { success: false, message: "User already exists" }
      
      );
    }
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
        username,
        isVerified: false,
      },
    });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    if (existingUserByEmail) {
      await prisma.user.update({
        where: {
          email,
          username
        },
        data: {
          password: hashedPassword,
          verifyCode: verificationCode,
          verifyCodeExpiry: expiryDate,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          verifyCode: verificationCode,
          verifyCodeExpiry: expiryDate,
          type:"credentials"
        },
      });
    }

    let emailResponse = await sendVerificationEmail(email, verificationCode);
    if (!emailResponse.success) {
      return response.status(500).json(
        { success: false, message: emailResponse.message },
       
      );
    }

    return response.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json(
      { success: false, message: "Error registering user" },
      
    );
  }
}