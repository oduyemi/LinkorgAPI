import { Request, Response, RequestHandler } from "express";
import BookingRequest from "../models/bookingRequest.model";
import Booking from "../models/booking.model"; 


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


// export const getBookingRequestById = async (req: Request, res: Response): Promise<void> => {
//   const { bookingRequestId } = req.params;

//   try {
//       const booking: IBooking | null = await Booking.findById(bookingRequestId);
//       if (!booking) {
//           res.status(404).json({ message: "Booking request not found" });
//           return;
//       }
//       res.status(200).json(booking);
//   } catch (error: any) {
//       res.status(500).json({ message: "Error retrieving booking request", error: error.message });
//   }
// };

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


// export const updateBookingRequestStatus: RequestHandler[] = [
//   authenticateAdmin, 
//   async (req: Request, res: Response): Promise<void> => { 
//     if (!req.session.admin) {
//       res.status(401).json({ message: "Unauthorized. Admin session not found." });
//       return; 
//     }

//     const { bookingRequestId } = req.params;
//     const { status } = req.body; 

//     try {
//       const validStatuses = ["pending", "resolved", "working", "rejected"];
//       if (!validStatuses.includes(status)) {
//         res.status(400).json({ message: "Invalid status value provided." });
//         return;
//       }

//       const bookingRequest = await BookingRequest.findById(bookingRequestId);
//       if (!bookingRequest) {
//         res.status(404).json({ message: "Booking request not found." });
//         return;
//       }

//       bookingRequest.status = status;
//       await bookingRequest.save();

//       const booking = await Booking.findOne({ bookingRequestId: bookingRequest._id });
//       if (booking) {
//         booking.status = status;
//         await booking.save();
//       }

//       const adminID = req.session.admin.adminID;
//       const adminName = `${req.session.admin.fname} ${req.session.admin.lname}`;

//       res.status(200).json({ 
//         message: `Booking request marked as ${status}`, 
//         data: { 
//           bookingRequest, 
//           adminID, 
//           adminName 
//         }
//       });
//       return; 
//     } catch (error: any) {
//       res.status(500).json({ message: "Error updating booking request status", error: error.message });
//       return;
//     }
//   },
// ];


export const updateBookingRequestStatus: RequestHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ message: "Unauthorized. Admin not found." });
      return;
    }

    const { bookingRequestId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "resolved", "working", "rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value provided." });
      return;
    }

    const bookingRequest = await BookingRequest.findById(bookingRequestId);
    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found." });
      return;
    }


    bookingRequest.status = status;
    await bookingRequest.save();

    const booking = await Booking.findById(bookingRequest.customerName);
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



// export const deleteBookingRequest = async (req: Request, res: Response): Promise<void> => {
//   const { bookingRequestId } = req.params;

//   try {
//       const deletedBooking = await Booking.findByIdAndDelete(bookingRequestId);
//       if (!deletedBooking) {
//           res.status(404).json({ message: "Booking request not found" });
//           return;
//       }
//       res.status(200).json({ message: "Booking request deleted successfully" });
//   } catch (error: any) {
//       res.status(500).json({ message: "Error deleting booking request", error: error.message });
//   }
// };

export const deleteBookingRequest = async (req: Request, res: Response): Promise<void> => {
  const { bookingRequestId } = req.params;

  try {

    const bookingRequest = await BookingRequest.findById(bookingRequestId);
    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingRequest.customerName);


    await BookingRequest.findByIdAndDelete(bookingRequestId);

    res.status(200).json({
      message: "Booking request and associated booking deleted successfully",
      deletedBooking,
    });
  } catch (error: any) {
    console.error("Error deleting booking request:", error);
    res.status(500).json({ message: "Error deleting booking request", error: error.message });
  }
};




