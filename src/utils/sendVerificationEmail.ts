import nodemailer from 'nodemailer';
import { render } from "@react-email/render";

// import { VerificationEmail } from '../../email/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';



const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "geovany7@ethereal.email",
        pass: "KBZes6RUCWsPTP77hd",
    },
});

export async function sendVerificationEmail(email: string, verifyCode: string,type = "Verify your Account"): Promise<ApiResponse> {
    try {
       
        let htmlBody = `<h1>${type}</h1>
        <p>your otp is ${verifyCode}</p>
        <p>your email is ${email}</p>
        `;


        // const emailHtml = await render(<VerificationEmail email={ email } otp={ verifyCode } />);
        const options = {
            from: 'geovany7@ethereal.email',
            to: 'himanshuholmes@gmail.com',
            subject: 'hello world',
            html: htmlBody,
        };
        let emailResponse = await transporter.sendMail(options);
        return {
            success: true,
            message: "email send successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Failed to send email",
        };
    }
}
