import { Request, RequestHandler, Response } from "express";
import Enterprise, { IEnterprise } from "../models/enterprise.model";
import EnterpriseRequest from "../models/enterpriseRequest.model"; 
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  admin?: {
    _id: string;
    fname: string;
    lname: string;
  };
}

export const getEnterpriseRequests = async (req: Request, res: Response) => {
  try {
    const enterpriseRequests = await EnterpriseRequest.find();
    res.status(200).json({ data: enterpriseRequests });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching enterprise requests", error: error.message });
  }
};

export const getEnterpriseRequestById = async (req: Request, res: Response): Promise<void> => {
  const { enterpriseRequestId } = req.params;

  try {
      const enterprise: IEnterprise | null = await EnterpriseRequest.findById(enterpriseRequestId);
      if (!enterprise) {
          res.status(404).json({ message: "Enterprise request not found" });
          return;
      }
      res.status(200).json(enterprise);
  } catch (error: any) {
      res.status(500).json({ message: "Error retrieving enterprise request", error: error.message });
  }
};

export const updateEnterpriseRequestStatus: RequestHandler = async (
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
                const enterpriseRequest = await EnterpriseRequest.findOne({ formID: customerObjectId });

                if (!enterpriseRequest) {
                  res.status(404).json({ message: "Enterprise request not found." });
                  return;
                }

      const validStatuses = ["pending", "resolved", "working", "rejected"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value provided." });
        return;
      }

      enterpriseRequest.status = status;
      await enterpriseRequest.save();

      const enterprise = await Enterprise.findById( customerObjectId);
      if (enterprise) {
        enterprise.status = status;
        await enterprise.save();
      }
  
      res.status(200).json({ 
        message: `Enterprise request marked as ${status}`, 
        data: { 
          enterpriseRequest, 
          adminID: req.admin._id,
          adminName: `${req.admin.fname} ${req.admin.lname}`,
        }
      });
    } catch (error: any) {
      
      console.error("Error updating Contact request status:", error);
      res.status(500).json({ message: "Error updating enterprise request status", error: error.message });
    }
  }



export const deleteEnterpriseRequest = async (req: Request, res: Response): Promise<void> => {
  const { formID } = req.params;

  try {
      const deletedEnterprise = await EnterpriseRequest.findOne({formID});
      if (!deletedEnterprise) {
          res.status(404).json({ message: "Enterprise request not found" });
          return;
      }
      const deleteEnterprise = Enterprise.findByIdAndDelete(formID)

      await EnterpriseRequest.findOneAndDelete({formID})
      res.status(200).json({ message: "Enterprise request and associated Enterprise deleted successfully", deleteEnterprise });
  } catch (error: any) {
      res.status(500).json({ message: "Error deleting enterprise request", error: error.message });
  }
};