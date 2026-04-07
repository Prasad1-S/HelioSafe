import { Resend } from "resend";
import env from 'dotenv';
env.config();
const resend = new Resend(process.env.RESEND_EMAIL_API);

export default async function SendAuthLink(email, token) {
    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Click To Login ⭐",
        html: `<p>Click to login: <a href="${process.env.BASE_URL}/auth/verify/${token}">Login Now</a></p>
               <p>This link expires in 1 hour.</p>`,
    });

    if (error) {
        console.log(error);
        return false;
    }

    console.log("Success!");
    return true;
}