import { Request, Response } from "express";
import Enquiry, { IEnquiry } from "../models/enquiry.model";
import { sendEmail } from "../utils/email";
import Inbox, { InboxDocument } from "../models/inbox.model"; 
import dotenv from "dotenv";

dotenv.config();

export const getAllEnquiries = async (req: Request, res: Response): Promise<void> => {
    try {
        const enquiries: IEnquiry[] = await Enquiry.find();
        res.status(200).json(enquiries);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving enquiries", error: error.message });
    }
};


export const getEnquiryById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const enquiry: IEnquiry | null = await Enquiry.findById(id);
        if (!enquiry) {
            res.status(404).json({ message: "Enquiry not found" });
            return;
        }
        res.status(200).json(enquiry);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving enquiry", error: error.message });
    }
};

export const newEnquiry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fname, lname, email, company, address, phone, state, topic, message } = req.body;
        if (![fname, lname, email, company, address, phone, state, topic, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const newEnquiryEntry = new Enquiry({ fname, lname, email, company, address, phone, state, topic, message });
        await newEnquiryEntry.save();
        const newInboxEntry: InboxDocument = new Inbox({
            formType: "Enquiry",
            senderName: `${fname} ${lname}`,
            senderEmail: email,
            subject: topic,
            message,
        });
        await newInboxEntry.save();

        // Email Notification
        const mailOptions = {
            from: `"LinkOrg Enquiries" <${process.env.SMTP_USERNAME}>`,
            to: "nok@linkorgnet.com",
            cc: "hello@linkorgnet.com",
            subject: `New Enquiry Received${topic ? `: ${topic}` : ""}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">New Enquiry Form Submission</h2>
                    <p>A new enquiry form has been submitted with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="font-weight: bold;">First Name:</td><td>${fname}</td></tr>
                        <tr><td style="font-weight: bold;">Last Name:</td><td>${lname}</td></tr>
                        <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                        <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                        <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                        <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                        <tr><td style="font-weight: bold;">State:</td><td>${state}</td></tr>
                        <tr><td style="font-weight: bold;">Topic:</td><td>${topic}</td></tr>
                        <tr><td style="font-weight: bold;">Message:</td><td>${message}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
                </div>
            `,
        };

        await sendEmail(mailOptions);
        res.status(201).json({ message: "New enquiry form added successfully, and email sent." });
    } catch (error) {
        console.error("Error during enquiry data creation or email sending:", error);
        res.status(500).json({ message: "Error creating enquiry data or sending email" });
    }
};
