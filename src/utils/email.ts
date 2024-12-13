import { SendMailOptions } from "nodemailer";
import { transporter } from "../utils/transporter";


interface EmailOptions extends SendMailOptions {
    from: string;
    to: string;
    cc?: string;
    subject: string;
    html: string;
}



export const sendEmail = async (mailOptions: EmailOptions): Promise<void> => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
