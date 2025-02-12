import { Request, Response } from "express";
import Enterprise, { IEnterprise } from "../models/enterprise.model";
import Inbox from "../models/inbox.model";
import { bookingMail } from "../helper/bookingMail";
import dotenv from "dotenv";
import { sendEmailWithRetry } from "../helper/emailLogic";
import EnterpriseRequest from "../models/enterpriseRequest.model";

dotenv.config();


export const getAllEnteprisePlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const entPlans: IEnterprise[] = await Enterprise.find();
        res.status(200).json(entPlans);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving internet enterprisr plan data", error: error.message });
    }
};


export const getEnterprisePlanById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const entplan: IEnterprise | null = await Enterprise.findById(id);
        if (!entplan) {
            res.status(404).json({ message: "Internet enterprise plan data not found" });
            return;
        }
        res.status(200).json(entplan);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving internet enterprise plan data", error: error.message });
    }
};


export const enterpriseBooking = [
    async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            fullname,
            company,
            email,
            phone,
            contact,
            contact_job,
            address,
            plan,
            how,
            note,
        } = req.body;

        const missingFields = [];
        if (!fullname) missingFields.push("fullname");
        if (!company) missingFields.push("company");
        if (!email) missingFields.push("email");
        if (!phone) missingFields.push("phone");
        if (!contact) missingFields.push("contact");
        if (!contact_job) missingFields.push("contact_job");
        if (!address) missingFields.push("address");
        if (!plan) missingFields.push("plan");
        if (!how) missingFields.push("how");

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return;
        }

        const addEnterpriseBooking = new Enterprise({
            fullname,
            company,
            email,
            phone,
            contact,
            contact_job,
            address,
            plan,
            how,
            note,
        });

        await addEnterpriseBooking.save();

        const newInboxEntry = new Inbox({
            formType: "Booking",
            senderName: fullname,
            senderEmail: email,
            message: `Internet Plan: ${plan}, Additional Note: ${note}`,
        });

        await newInboxEntry.save();
        const enterpriseRequest = new EnterpriseRequest({
            admin: null,
            formID: addEnterpriseBooking._id,
            requestDate: new Date(),
            time: "N/A",
            status: "pending",
        });

        await enterpriseRequest.save();
        await bookingMail(email, fullname);

        const subject = "New Booking For Enterprise Internet Plan Booking";
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Booking For Enterprise Internet Plan</h2>
                <p>A new booking form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${fullname}</td></tr>
                    <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                    <tr><td style="font-weight: bold;">Plan:</td><td>${plan}</td></tr>
                    <tr><td style="font-weight: bold;">Contact Person:</td><td>${contact}</td></tr>
                    <tr><td style="font-weight: bold;">Job Title:</td><td>${contact_job}</td></tr>
                    <tr><td style="font-weight: bold;">How did you hear about us?:</td><td>${how}</td></tr>
                    <tr><td style="font-weight: bold;">Additional Note:</td><td>${note}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
                <p style="margin-top: 20px;">You can send an email directly to the Customer via <b><span> <a href="mailto:${email}">${email}</a></span></b> where necessary.</p>
            </div>
        `;

        const recipients = ["hello@linkorgnet.com", "noc@linkorgnet.com"];

        await Promise.all(
            recipients.map((recipient) =>
                sendEmailWithRetry(recipient, subject, htmlContent, 3).catch((err) =>
                    console.error(`Failed to send email to ${recipient}:`, err)
                )
            )
        );

        res.status(201).json({ message: "New Enterprise Booking request made successfully, and email sent.", addEnterpriseBooking });
    } catch (error) {
        console.error("Error during enterprise booking creation or email sending:", error);
        res.status(500).json({
            message: "Error creating enterprise booking or sending email",
        });
    }
}
];
