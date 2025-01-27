import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT!), // Ensure this is numeric
    secure: process.env.SMTP_PORT === "25", // Use secure true for port 465
    auth: {
        user: process.env.SMTP_USERNAME, 
        pass: process.env.SMTP_PWD, 
    },
    tls: {
        ciphers: 'SSLv3', 
        rejectUnauthorized: false, // Consider setting to true for better security
    },
    logger: false,  
    debug: false,
});
