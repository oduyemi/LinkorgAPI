import { Request, Response, RequestHandler } from "express";
import BookingRequest from "../models/bookingRequest.model";
import Booking from "../models/booking.model"; 
import mongoose from "mongoose";


interface AuthenticatedRequest extends Request {
  admin?: {
    _id: string;
    fname: string;
    lname: string;
  };
}

export const getBookingRequests = async (req: Request, res: Response) => {
  try {
    const bookingRequests = await BookingRequest.find();
    res.status(200).json({ data: bookingRequests });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching booking requests", error: error.message });
  }
};

export const getBookingRequestById = async (req: Request, res: Response): Promise<void> => {
  const { bookingRequestId } = req.params;

  try {
      const bookingRequest = await BookingRequest.findById(bookingRequestId);
      if (!bookingRequest) {
          res.status(404).json({ message: "Booking request not found" });
          return;
      }
      res.status(200).json(bookingRequest);
  } catch (error: any) {
      res.status(500).json({ message: "Error retrieving booking request", error: error.message });
  }
};


export const updateBookingRequestStatus: RequestHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ message: "Unauthorized. Admin not found." });
      return;
    }

    const { formID } = req.params;
    const { status } = req.body;

    if (!formID) {
      res.status(400).json({ message: "Missing formID in request parameters." });
      return;
    }

    if (!mongoose.isValidObjectId(formID)) {
      console.error("Invalid ObjectId format:", formID);
      res.status(400).json({ message: "Invalid formID ObjectId format." });
      return;
    }

    const customerObjectId = new mongoose.Types.ObjectId(formID);


    const bookingRequest = await BookingRequest.findOne({ formID: customerObjectId });
    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request reference ID not found." });
      return;
    }

    const validStatuses = ["pending", "resolved", "working", "rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value provided." });
      return;
    }

    bookingRequest.status = status;
    await bookingRequest.save();

    const booking = await Booking.findById(customerObjectId);
    if (booking) {
      booking.status = status;
      await booking.save();
    }

    res.status(200).json({
      message: `Booking request marked as ${status}`,
      data: {
        bookingRequest,
        adminID: req.admin._id,
        adminName: `${req.admin.fname} ${req.admin.lname}`,
      },
    });
  } catch (error: any) {
    console.error("Error updating booking request status:", error);
    res.status(500).json({ message: "Error updating booking request status", error: error.message });
  }
};


export const deleteBookingRequest = async (req: Request, res: Response): Promise<void> => { 
  const { formID } = req.params; 

  try {

    const bookingRequest = await BookingRequest.findOne({ formID });
    
    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    const deletedBooking = await Booking.findByIdAndDelete(formID);

    await BookingRequest.findOneAndDelete({ formID });

    res.status(200).json({
      message: "Booking request and associated booking deleted successfully",
      deletedBooking,
    });
  } catch (error: any) {
    console.error("Error deleting booking request:", error);
    res.status(500).json({ message: "Error deleting booking request", error: error.message });
  }
};



