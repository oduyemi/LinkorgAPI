import { Request, Response } from "express";
import Contact, { IContact } from "../models/contact.model";



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

        if (![name, email, phone, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return; 
        }

        const addContact = new Contact({ name, email, phone, subject, message });
        await addContact.save();
        res.status(201).json({ message: "New contact form added successfully" });
    } catch (error) {
        console.error("Error during contact data creation:", error);
        res.status(500).json({ message: "Error creating contact data" });
    }
};


