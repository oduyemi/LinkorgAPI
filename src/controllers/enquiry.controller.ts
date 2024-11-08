import { Request, Response } from "express";
import Enquiry, { IEnquiry } from "../models/enquiry.model";




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
        const { name, lname, email, company, address, phone, state, topic, message } = req.body;

        if (![name, lname, email, company, address, phone, state, topic, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return; 
        }
        const addEnquiry = new Enquiry({ name, lname, email, company, address, phone, state, topic, message });
        await addEnquiry.save();
        res.status(201).json({ message: "New enquiry form added successfully" });
    } catch (error) {
        console.error("Error during enquiry data creation:", error);
        res.status(500).json({ message: "Error creating enquiry data" });
    }
};



