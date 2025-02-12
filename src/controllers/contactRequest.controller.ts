import { Request, Response, RequestHandler } from "express";
import Contact, { IContact } from "../models/contact.model";
import ContactRequest from "../models/contactRequest.model"; 
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  admin?: {
    _id: string;
    fname: string;
    lname: string;
  };
}

export const getContactRequests = async (req: Request, res: Response) => {
  try {
    const contactRequests = await ContactRequest.find();
    res.status(200).json({ data: contactRequests });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching contact form requests", error: error.message });
  }
};

export const getContactRequestById = async (req: Request, res: Response): Promise<void> => {
  const { contactRequestId } = req.params;

  try {
      const contactRequest: IContact| null = await ContactRequest.findById(contactRequestId);
      if (!contactRequest) {
          res.status(404).json({ message: "Contact request not found" });
          return;
      }
      res.status(200).json(contactRequest);
  } catch (error: any) {
      res.status(500).json({ message: "Error retrieving contact request", error: error.message });
  }
};

export const updateContactRequestStatus: RequestHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
try{
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
            const contactRequest = await ContactRequest.findOne({ formID: customerObjectId });
            if (!contactRequest) {
              res.status(404).json({ message: "Contact request reference ID not found." });
              return;
            }

      const validStatuses = ["pending", "resolved", "working", "rejected"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value provided." });
        return;
      }

      contactRequest.status = status;
      await contactRequest.save();

      const contactList = await Contact.findById( customerObjectId);
      if (contactList) {
        contactList.status = status;
        await contactList.save();
    }
   
      res.status(200).json({ 
        message: `Contact request marked as ${status}`, 
        data: { 
          contactRequest, 
          adminID: req.admin._id,
          adminName: `${req.admin.fname} ${req.admin.lname}`,
        },
      });

    } catch (error: any) {
      console.error("Error updating Contact request status:", error);
      res.status(500).json({ message: "Error updating contact request status", error: error.message });
    }
  };

export const deleteContactRequest = async (req: Request, res: Response): Promise<void> => {
  const { formID } = req.params;

  try {
      const contactRequest = await ContactRequest.findOne({formID});
      if (!contactRequest) {
          res.status(404).json({ message: "Contact request not found" });
          return;
      }

      const deleteContact = Contact.findByIdAndDelete(formID)

      await ContactRequest.findOneAndDelete({ formID })
      res.status(200).json({ message: "Contact request and associated contact deleted successfully", deleteContact });
  } catch (error: any) {
      res.status(500).json({ message: "Error deleting contact request", error: error.message });
  }
};