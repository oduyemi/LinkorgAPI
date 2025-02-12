import { Request, RequestHandler, Response } from "express";
import Retail, { IRetail } from "../models/retail.model";
import RetailRequest from "../models/retailRequest.model"; 
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  admin?: {
    _id: string;
    fname: string;
    lname: string;
  };
}

export const getRetailRequests = async (req: Request, res: Response) => {
    try {
      const retailRequests = await RetailRequest.find();
      res.status(200).json({ data: retailRequests });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching retail requests", error: error.message });
    }
  };


  export const getRetailRequestById = async (req: Request, res: Response): Promise<void> => {
    const { retailRequestId } = req.params;
  
    try {
        const retail: IRetail | null = await RetailRequest.findById(retailRequestId);
        if (!retail) {
            res.status(404).json({ message: "Retail request not found" });
            return;
        }
        res.status(200).json(retail);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving retail request", error: error.message });
    }
  };

  export const updateRetailRequestStatus: RequestHandler = async (
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
                  const retailRequest = await RetailRequest.findOne({ formID: customerObjectId });

                          
        if (!retailRequest) {
          res.status(404).json({ message: "Retail request not found." });
          return;
        }

        const validStatuses = ["pending", "resolved", "working", "rejected"];
        if (!validStatuses.includes(status)) {
          res.status(400).json({ message: "Invalid status value provided." });
          return;
        }
  
        retailRequest.status = status;
        await retailRequest.save();
  
        const retail = await Retail.findById( customerObjectId);
        if (retail) {
          retail.status = status;
          await retail.save();
        }
  
  
        res.status(200).json({ 
          message: `Retail request marked as ${status}`, 
          data: { 
            retailRequest, 
            adminID: req.admin._id,
            adminName: `${req.admin.fname} ${req.admin.lname}`, 
          }
        });
      } catch (error: any) {
        console.error("Error updating retail request status:", error);
        res.status(500).json({ message: "Error updating retail request status", error: error.message });
        return;
      }
    }

  export const deleteRetailRequest = async (req: Request, res: Response): Promise<void> => {
    const { formID } = req.params;
  
    try {
        const deletedRetail = await RetailRequest.findOne({formID});
        if (!deletedRetail) {
            res.status(404).json({ message: "Retail request not found" });
            return;
        }

        const deleteRetail = Retail.findByIdAndDelete(formID)

        await RetailRequest.findOneAndDelete({formID})

        res.status(200).json({ message: "Retail request deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting retail request", error: error.message });
    }
  };