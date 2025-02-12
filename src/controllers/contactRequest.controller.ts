import { Request, Response, RequestHandler } from "express";
import Contact, { IContact } from "../models/contact.model";
import ContactRequest from "../models/contactRequest.model"; 
// import { authenticateAdmin } from "../middlewares/auth.middleware";

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


// export const getContactRequestById = async (req: Request, res: Response): Promise<void> => {
//   const { contactRequestId } = req.params;

//   try {
//       const contact: IContact| null = await Contact.findById(contactRequestId);
//       if (!contact) {
//           res.status(404).json({ message: "Contact request not found" });
//           return;
//       }
//       res.status(200).json(contact);
//   } catch (error: any) {
//       res.status(500).json({ message: "Error retrieving contact request", error: error.message });
//   }
// };

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

  if (!req.admin) {
    res.status(401).json({ message: "Unauthorized. Admin not found." });
    return;
  }

    const { contactRequestId } = req.params;
    const { status } = req.body; 

    try {
      const validStatuses = ["pending", "resolved", "working", "rejected"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value provided." });
        return;
      }

      const contactRequest = await ContactRequest.findById(contactRequestId);
      if (!contactRequest) {
        res.status(404).json({ message: "Contact request not found." });
        return;
      }

      contactRequest.status = status;
      await contactRequest.save();

      const contactList = await Contact.findOne( contactRequest.contact);
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
        }
      });

    } catch (error: any) {
      res.status(500).json({ message: "Error updating contact request status", error: error.message });
      return;
    }
  }


// export const deleteContactRequest = async (req: Request, res: Response): Promise<void> => {
//   const { contactRequestId } = req.params;

//   try {
//       const deletedContact = await Contact.findByIdAndDelete(contactRequestId);
//       if (!deletedContact) {
//           res.status(404).json({ message: "Contact request not found" });
//           return;
//       }
//       res.status(200).json({ message: "Contact request deleted successfully" });
//   } catch (error: any) {
//       res.status(500).json({ message: "Error deleting contact request", error: error.message });
//   }
// };


export const deleteContactRequest = async (req: Request, res: Response): Promise<void> => {
  const { contactRequestId } = req.params;

  try {
      const contactRequest = await ContactRequest.findById(contactRequestId);
      if (!contactRequest) {
          res.status(404).json({ message: "Contact request not found" });
          return;
      }

      const deleteContact = Contact.findByIdAndDelete(contactRequest.contact)

      await ContactRequest.findByIdAndDelete(contactRequestId)
      res.status(200).json({ message: "Contact request and associated contact deleted successfully", deleteContact });
  } catch (error: any) {
      res.status(500).json({ message: "Error deleting contact request", error: error.message });
  }
};