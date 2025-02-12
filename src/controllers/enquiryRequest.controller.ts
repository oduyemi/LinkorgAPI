import { Request, RequestHandler, Response } from "express";
import Enquiry, { IEnquiry } from "../models/enquiry.model";
import EnquiryRequest from "../models/enquiryRequest.model"; 
// import { authenticateAdmin } from "../middlewares/auth.middleware";

interface AuthenticatedRequest extends Request {
  admin?: {
    _id: string;
    fname: string;
    lname: string;
  };
}

export const getEnquiryRequests = async (req: Request, res: Response) => {
  try {
    const enquiryRequests = await EnquiryRequest.find();
    res.status(200).json({ data: enquiryRequests });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching enquiry form requests", error: error.message });
  }
};


// export const getEnquiryRequestById = async (req: Request, res: Response): Promise<void> => {
//   const { enquiryRequestId } = req.params;

//   try {
//       const enquiry: IEnquiry | null = await Enquiry.findById(enquiryRequestId);
//       if (!enquiry) {
//           res.status(404).json({ message: "Enquiry request not found" });
//           return;
//       }
//       res.status(200).json(enquiry);
//   } catch (error: any) {
//       res.status(500).json({ message: "Error retrieving enquiry request", error: error.message });
//   }
// };

// export const updateEnquiryRequestStatus: RequestHandler[] = [
//   authenticateAdmin, 
//   async (req: Request, res: Response): Promise<void> => { 
//     if (!req.session.admin) {
//       res.status(401).json({ message: "Unauthorized. Admin session not found." });
//       return; 
//     }

//     const { enquiryRequestId } = req.params;
//     const { status } = req.body; 

//     try {
//       const validStatuses = ["pending", "resolved", "working", "rejected"];
//       if (!validStatuses.includes(status)) {
//         res.status(400).json({ message: "Invalid status value provided." });
//         return;
//       }

//       const enquiryRequest = await EnquiryRequest.findById(enquiryRequestId);
//       if (!enquiryRequest) {
//         res.status(404).json({ message: "Enquiry request not found." });
//         return;
//       }

//       enquiryRequest.status = status;
//       await enquiryRequest.save();

//       const enquiry = await Enquiry.findOne({ enquiryRequestId: enquiryRequest._id });
//       if (enquiry) {
//         enquiry.status = status;
//         await enquiry.save();
//       }

//       const adminID = req.session.admin.adminID;
//       const adminName = `${req.session.admin.fname} ${req.session.admin.lname}`;

//       res.status(200).json({ 
//         message: `Enquiry request marked as ${status}`, 
//         data: { 
//           enquiryRequest, 
//           adminID, 
//           adminName 
//         }
//       });
//       return; 
//     } catch (error: any) {
//       res.status(500).json({ message: "Error updating enquiry request status", error: error.message });
//       return;
//     }
//   },
// ];

export const getEnquiryRequestById = async (req: Request, res: Response): Promise<void> => {
  const { enquiryRequestId } = req.params;

  try {
      const enquiryRequest: IEnquiry | null = await EnquiryRequest.findById(enquiryRequestId);
      if (!enquiryRequest) {
          res.status(404).json({ message: "Enquiry request not found" });
          return;
      }
      res.status(200).json(enquiryRequest);
  } catch (error: any) {
      res.status(500).json({ message: "Error retrieving enquiry request", error: error.message });
  }
};

export const updateEnquiryRequestStatus:  RequestHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {

   if (!req.admin) {
    res.status(401).json({ message: "Unauthorized. Admin not found." });
    return;
  }


    const { enquiryRequestId } = req.params;
    const { status } = req.body; 

    try {
      const validStatuses = ["pending", "resolved", "working", "rejected"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value provided." });
        return;
      }

      const enquiryRequest = await EnquiryRequest.findById(enquiryRequestId);
      if (!enquiryRequest) {
        res.status(404).json({ message: "Enquiry request not found." });
        return;
      }

      enquiryRequest.status = status;
      await enquiryRequest.save();

      const enquiry = await Enquiry.findOne(enquiryRequest.enquiry);
      if (enquiry) {
        enquiry.status = status;
        await enquiry.save();
      }

      res.status(200).json({ 
        message: `Enquiry request marked as ${status}`, 
        data: { 
          enquiryRequest, 
          adminID: req.admin._id,
          adminName: `${req.admin.fname} ${req.admin.lname}`,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating enquiry request status", error: error.message });
      return;
    }
  }

// export const deleteEnquiryRequest = async (req: Request, res: Response): Promise<void> => {
//   const { enquiryRequestId } = req.params;

//   try {
//       const deletedEnquiry = await Enquiry.findByIdAndDelete(enquiryRequestId);
//       if (!deletedEnquiry) {
//           res.status(404).json({ message: "Enquiry request not found" });
//           return;
//       }
//       res.status(200).json({ message: "Enquiry request deleted successfully" });
//   } catch (error: any) {
//       res.status(500).json({ message: "Error deleting enquiry request", error: error.message });
//   }
// };

export const deleteEnquiryRequest = async (req: Request, res: Response): Promise<void> => {
  const { enquiryRequestId } = req.params;

  try {
      const deletedEnquiry = await EnquiryRequest.findById(enquiryRequestId);
      if (!deletedEnquiry) {
          res.status(404).json({ message: "Contact request not found" });
          return;
      }

      const deleteEnquiry = Enquiry.findByIdAndDelete(deletedEnquiry.enquiry)

      await EnquiryRequest.findByIdAndDelete(enquiryRequestId)
      res.status(200).json({ message: "Contact request and associated contact deleted successfully", deleteEnquiry });
  } catch (error: any) {
      res.status(500).json({ message: "Error deleting contact request", error: error.message });
  }
};