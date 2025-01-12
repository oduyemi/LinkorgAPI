import { Request, Response } from "express";
import Contact, { IContact } from "../models/contact.model";
import Inbox from "../models/inbox.model";
import { contactMail } from "../helper/contactMail";
import dotenv from "dotenv";
import { sendEmailWithRetry } from "../helper/emailSample";


dotenv.config();


export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts: IContact[] = await Contact.find();
        res.status(200).json(contacts);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
};


export const getContactById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const contact: IContact | null = await Contact.findById(id);
        if (!contact) {
            res.status(404).json({ message: "Contact data not found" });
            return;
        }
        res.status(200).json(contact);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
};




export const newContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (![name, email, phone, message].every(Boolean)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const newContactEntry = new Contact({ name, email, phone, subject, message });
        await newContactEntry.save();

        const newInboxEntry = new Inbox({
            formType: "Contact",
            senderName: name,
            senderEmail: email,
            subject,
            message,
        });
        await newInboxEntry.save();

        await contactMail(email);

        const subjectForAdmin = `New Contact Form Submission${subject ? `: ${subject}` : ""}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
                <p>A new contact form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${name}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    ${subject ? `<tr><td style="font-weight: bold;">Subject:</td><td>${subject}</td></tr>` : ""}
                    <tr><td style="font-weight: bold;">Message:</td><td>${message}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
            </div>`;

        await sendEmailWithRetry("nok@linkorgnet.com", subjectForAdmin, htmlContent, 3);

        res.status(201).json({ message: "New contact form added successfully, and email sent.", newContactEntry });
    } catch (error) {
        console.error("Error during contact data creation or email sending:", error);
        res.status(500).json({ message: "Error creating contact data or sending email" });
    }
};