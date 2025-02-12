import { Request, RequestHandler, Response } from "express";
import Retail, { IRetail } from "../models/retail.model";
import RetailRequest from "../models/retailRequest.model"; 
// import { authenticateAdmin } from "../middlewares/auth.middleware";

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


  // export const getRetailRequestById = async (req: Request, res: Response): Promise<void> => {
  //   const { retailRequestId } = req.params;
  
  //   try {
  //       const retail: IRetail | null = await Retail.findById(retailRequestId);
  //       if (!retail) {
  //           res.status(404).json({ message: "Retail request not found" });
  //           return;
  //       }
  //       res.status(200).json(retail);
  //   } catch (error: any) {
  //       res.status(500).json({ message: "Error retrieving retail request", error: error.message });
  //   }
  // };

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

  // export const updateRetailRequestStatus: RequestHandler[] = [
  //   authenticateAdmin, 
  //   async (req: Request, res: Response): Promise<void> => { 
  //     if (!req.session.admin) {
  //       res.status(401).json({ message: "Unauthorized. Admin session not found." });
  //       return; // Explicit return
  //     }
  
  //     const { retailRequestId } = req.params;
  //     const { status } = req.body; 
  
  //     try {
  //       const validStatuses = ["pending", "resolved", "working", "rejected"];
  //       if (!validStatuses.includes(status)) {
  //         res.status(400).json({ message: "Invalid status value provided." });
  //         return;
  //       }
  
  //       const retailRequest = await RetailRequest.findById(retailRequestId);
  //       if (!retailRequest) {
  //         res.status(404).json({ message: "Retail request not found." });
  //         return;
  //       }
  
  //       retailRequest.status = status;
  //       await retailRequest.save();
  
  //       const retail = await Retail.findOne({ retailRequestId: retailRequest._id });
  //       if (retail) {
  //         retail.status = status;
  //         await retail.save();
  //       }
  
  //       const adminID = req.session.admin.adminID;
  //       const adminName = `${req.session.admin.fname} ${req.session.admin.lname}`;
  
  //       res.status(200).json({ 
  //         message: `Retail request marked as ${status}`, 
  //         data: { 
  //           retailRequest, 
  //           adminID, 
  //           adminName 
  //         }
  //       });
  //       return; 
  //     } catch (error: any) {
  //       res.status(500).json({ message: "Error updating retail request status", error: error.message });
  //       return;
  //     }
  //   },
  // ];

  export const updateRetailRequestStatus: RequestHandler = async (
    req: AuthenticatedRequest, 
    res: Response
  ): Promise<void> => {
  
     if (!req.admin) {
      res.status(401).json({ message: "Unauthorized. Admin not found." });
      return;
    }
  
  
      const { retailRequestId } = req.params;
      const { status } = req.body; 
  
      try {
        const validStatuses = ["pending", "resolved", "working", "rejected"];
        if (!validStatuses.includes(status)) {
          res.status(400).json({ message: "Invalid status value provided." });
          return;
        }
  
        const retailRequest = await RetailRequest.findById(retailRequestId);
        if (!retailRequest) {
          res.status(404).json({ message: "Retail request not found." });
          return;
        }
  
        retailRequest.status = status;
        await retailRequest.save();
  
        const retail = await Retail.findOne(retailRequest.retail);
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
        return; 
      } catch (error: any) {
        res.status(500).json({ message: "Error updating retail request status", error: error.message });
        return;
      }
    }

  // export const deleteRetailRequest = async (req: Request, res: Response): Promise<void> => {
  //   const { retailRequestId } = req.params;
  
  //   try {
  //       const deletedRetail = await Retail.findByIdAndDelete(retailRequestId);
  //       if (!deletedRetail) {
  //           res.status(404).json({ message: "Retail request not found" });
  //           return;
  //       }
  //       res.status(200).json({ message: "Retail request deleted successfully" });
  //   } catch (error: any) {
  //       res.status(500).json({ message: "Error deleting retail request", error: error.message });
  //   }
  // };

  export const deleteRetailRequest = async (req: Request, res: Response): Promise<void> => {
    const { retailRequestId } = req.params;
  
    try {
        const deletedRetail = await RetailRequest.findByIdAndDelete(retailRequestId);
        if (!deletedRetail) {
            res.status(404).json({ message: "Retail request not found" });
            return;
        }

        const deleteRetail = Retail.findByIdAndDelete(deletedRetail.retail)

        await RetailRequest.findByIdAndDelete(retailRequestId)
        res.status(200).json({ message: "Enterprise request and associated Enterprise deleted successfully", deleteRetail });

        res.status(200).json({ message: "Retail request deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting retail request", error: error.message });
    }
  };