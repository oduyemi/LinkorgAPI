import { Request, Response } from "express";
import Retail, { IRetail } from "../models/retail.model";
import Inbox from "../models/inbox.model";
import { bookingMail } from "../helper/bookingMail";
import dotenv from "dotenv";
import { sendEmailWithRetry } from "../helper/emailSample";


dotenv.config();


export const getAllRetailPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const retailPlans: IRetail[] = await Retail.find();
        res.status(200).json(retailPlans);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving internet retail plan data", error: error.message });
    }
};


export const getRetailPlanById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const retailplan: IRetail | null = await Retail.findById(id);
        if (!retailplan) {
            res.status(404).json({ message: "Internet retail plan data not found" });
            return;
        }
        res.status(200).json(retailplan);
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving internet retail plan data", error: error.message });
    }
};


export const retailBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            fullname,
            company,
            email,
            phone,
            address,
            plan,
            price,
            installation,
            how,
            note,
        } = req.body;

        if (![fullname, email, phone, address, plan, price, installation, how].every(Boolean)) {
            res.status(400).json({ message: "All required fields must be filled" });
            return;
        }

        const taxRate = 0.075;
        const totalAmount = (price + installation) * (1 + taxRate);
        const addRetailBooking = new Retail({
            fullname,
            company,
            email,
            phone,
            address,
            plan,
            price,
            installation,
            how,
            note,
            totalAmount,  
        });

        await addRetailBooking.save();
        const newInboxEntry = new Inbox({
            formType: "Booking",
            senderName: fullname,
            senderEmail: email,
            message: `Service: ${plan}, Additional Note: ${note}, Total Amount: ${totalAmount}`,
        });

        await newInboxEntry.save();
        await bookingMail(email);
        const subject = "New Booking For Retail/SME Internet Plan Booking";
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Booking For Retail/SME Internet Plan Booking</h2>
                <p>A new booking form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${fullname}</td></tr>
                    <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                    <tr><td style="font-weight: bold;">State:</td><td>${plan}</td></tr>
                    <tr><td style="font-weight: bold;">LGA:</td><td>${price}</td></tr>
                    <tr><td style="font-weight: bold;">Service:</td><td>${installation}</td></tr>
                    <tr><td style="font-weight: bold;">How did you hear about us?:</td><td>${how}</td></tr>
                    <tr><td style="font-weight: bold;">Additional Note:</td><td>${note}</td></tr>
                    <tr><td style="font-weight: bold;">Total Amount:</td><td>${totalAmount.toFixed(2)}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
            </div>
        `;

        await sendEmailWithRetry("noc@linkorgnet.com", subject, htmlContent, 3);
        res.status(201).json({
            message: "New booking form added successfully, and email sent.",
            newInboxEntry,
        });
    } catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({
            message: "Error creating booking or sending email",
        });
    }
};
