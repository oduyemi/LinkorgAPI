import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";


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
        const { name, company,  email,  address,  service,  how,  phone,  state,  lga,  specialRequest } = req.body;

        if (![name, company,  email,  address,  service,  how,  phone,  state,  lga,  specialRequest].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return; 
        }
        const addBooking = new Booking({ name, company,  email,  address,  service,  how,  phone,  state,  lga,  specialRequest });
        await addBooking.save();
        res.status(201).json({ message: "New booking form added successfully" });
    } catch (error) {
        console.error("Error during booking data creation:", error);
        res.status(500).json({ message: "Error creating booking data" });
    }
};

