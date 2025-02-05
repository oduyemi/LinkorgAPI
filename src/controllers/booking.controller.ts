import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";
import Inbox from "../models/inbox.model";
import { bookingMail } from "../helper/bookingMail";
import dotenv from "dotenv";
import { sendEmailWithRetry } from "../helper/emailLogic";


dotenv.config();


export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings: IBooking[] = await Booking.find();
        res.status(200).json({message: "All bookings successfully retrived", bookings});
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
        res.status(200).json({message: "booking successfully retrived", booking});
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving booking data", error: error.message });
    }
};


export const newBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            company,
            email,
            address,
            service,
            how,
            phone,
            state,
            lga,
            specialRequest,
        } = req.body;

        if (
            ![name, company, email, address, service, how, phone, state, lga, specialRequest].every(Boolean)
        ) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const addBooking = new Booking({
            name,
            company,
            email,
            address,
            service,
            how,
            phone,
            state,
            lga,
            specialRequest,
            status: "pending",
        });

        await addBooking.save();

        const newInboxEntry = new Inbox({
            formType: "Booking",
            senderName: name,
            senderEmail: email,
            message: `Service: ${service}, Special Request: ${specialRequest}`,
        });

        await newInboxEntry.save();

        await bookingMail(email, name);

        // Email content
        const subject = "New Booking Form Submission";
        const htmlContent = `
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
                    <p style="margin-top: 20px;">You can send an email directly to the Customer via <b><span> <a href="mailto:${email}">${email}</a></span></b> where necessary.</p>
           
            </div>
        `;

        // Send email to both addresses
        const recipients = ["hello@linkorgnet.com", "noc@linkorgnet.com"];
        await Promise.all(
            recipients.map((recipient) =>
                sendEmailWithRetry(recipient, subject, htmlContent, 3)
            )
        );

        res.status(201).json({
            message: "New booking form added successfully, and emails sent.",
            newInboxEntry,
        });
    } catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({
            message: "Error creating booking or sending emails",
        });
    }
};



export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access the bookingId from req.params
    const { id } = req.params;
    const { status } = req.body; // Status should be in the request body

    // Ensure the status is provided
    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    // Find and update the booking status by ID
    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      updatedBooking: booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status" });
  }
};




export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params; // Booking ID from URL params

        if (!bookingId) {
            res.status(400).json({ message: "Booking ID is required" });
            return;
        }

        // Find the booking by ID and delete it
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        res.status(200).json({
            message: "Booking deleted successfully",
            deletedBooking,
        });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Error deleting booking" });
    }
};


