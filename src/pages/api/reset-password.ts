import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { email, verifyCode, password } = req.body;

  try {
    const newPassword = password;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetRequest = await prisma.resetPassword.findUnique({
      where: { userId: user.id },
    });

    if (!resetRequest)
      return res.status(400).json({ message: "No reset request found." });

    // Verify code and expiry
    if (
      resetRequest.verifyCode !== verifyCode ||
      new Date() > resetRequest.verifyCodeExpiry
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and delete reset request
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.resetPassword.delete({ where: { userId: user.id } });

    res.status(200).json({success:true, message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Something went wrong." });
  }
}
