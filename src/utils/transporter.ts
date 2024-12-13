import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT!),              
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME, 
        pass: process.env.SMTP_PWD, 
    },
    tls: {
        ciphers: 'SSLv3', 
        rejectUnauthorized: false,
        },
        logger: false,  
        debug: false,
});