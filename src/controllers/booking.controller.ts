import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/email";
import dotenv from "dotenv";


dotenv.config();



export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!, 25),              
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


export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings: IBooking[] = await Booking.find();
        res.status(200).json(bookings);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving booking data", error: error.message });
    }
};


export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const booking: IBooking | null = await Booking.findById(id);
        if (!booking) {
            res.status(404).json({ message: "Booking data not found" });
            return;
        }
        res.status(200).json(booking);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving booking data", error: error.message });
    }
};



export const newBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, company, email, address, service, how, phone, state, lga, specialRequest } = req.body;

        if (![name, company, email, address, service, how, phone, state, lga, specialRequest].every(Boolean)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const addBooking = new Booking({ name, company, email, address, service, how, phone, state, lga, specialRequest });
        await addBooking.save();

        const mailOptions = {
            from: `"LinkOrg Bookings" <${process.env.SMTP_USERNAME}>`,
            to: "nok@linkorgnet.com",
            cc: "hello@linkorgnet.com",
            subject: "New Booking Form Submission",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">New Booking Form Submission</h2>
                    <p>A new booking form has been submitted with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="font-weight: bold;">Name:</td><td>${name}</td></tr>
                        <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                        <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                        <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                        <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                        <tr><td style="font-weight: bold;">State:</td><td>${state}</td></tr>
                        <tr><td style="font-weight: bold;">LGA:</td><td>${lga}</td></tr>
                        <tr><td style="font-weight: bold;">Service:</td><td>${service}</td></tr>
                        <tr><td style="font-weight: bold;">How:</td><td>${how}</td></tr>
                        <tr><td style="font-weight: bold;">Special Request:</td><td>${specialRequest}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
                </div>
            `,
        };

        await sendEmail(mailOptions);

        res.status(201).json({ message: "New booking form added successfully, and email sent." });
    } catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({ message: "Error creating booking or sending email" });
    }
};
