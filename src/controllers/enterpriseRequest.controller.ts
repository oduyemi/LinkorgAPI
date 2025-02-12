import { Request, RequestHandler, Response } from "express";
import Enterprise, { IEnterprise } from "../models/enterprise.model";
import EnterpriseRequest from "../models/enterpriseRequest.model"; 
// import { authenticateAdmin } from "../middlewares/auth.middleware";

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


// export const getEnterpriseRequestById = async (req: Request, res: Response): Promise<void> => {
//   const { enterpriseRequestId } = req.params;

//   try {
//       const enterprise: IEnterprise | null = await Enterprise.findById(enterpriseRequestId);
//       if (!enterprise) {
//           res.status(404).json({ message: "Enterprise request not found" });
//           return;
//       }
//       res.status(200).json(enterprise);
//   } catch (error: any) {
//       res.status(500).json({ message: "Error retrieving enterprise request", error: error.message });
//   }
// };

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

   if (!req.admin) {
    res.status(401).json({ message: "Unauthorized. Admin not found." });
    return;
  }

    const { enterpriseRequestId } = req.params;
    const { status } = req.body; 

    try {
      const validStatuses = ["pending", "resolved", "working", "rejected"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value provided." });
        return;
      }

      const enterpriseRequest = await EnterpriseRequest.findById(enterpriseRequestId);
      if (!enterpriseRequest) {
        res.status(404).json({ message: "Enterprise request not found." });
        return;
      }

      enterpriseRequest.status = status;
      await enterpriseRequest.save();

      const enterprise = await Enterprise.findOne(enterpriseRequest.enterprise);
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
      res.status(500).json({ message: "Error updating enterprise request status", error: error.message });
      return;
    }
  }



// export const deleteEnterpriseRequest = async (req: Request, res: Response): Promise<void> => {

//   const { enterpriseRequestId } = req.params;

//   try {
//       const deletedEnterprise = await Enterprise.findByIdAndDelete(enterpriseRequestId);
//       if (!deletedEnterprise) {
//           res.status(404).json({ message: "Enterprise request not found" });
//           return;
//       }
//       res.status(200).json({ message: "Enterprise request deleted successfully" });
//   } catch (error: any) {
//       res.status(500).json({ message: "Error deleting enterprise request", error: error.message });
//   }
// };

export const deleteEnterpriseRequest = async (req: Request, res: Response): Promise<void> => {
  const { enterpriseRequestId } = req.params;

  try {
      const deletedEnterprise = await EnterpriseRequest.findByIdAndDelete(enterpriseRequestId);
      if (!deletedEnterprise) {
          res.status(404).json({ message: "Enterprise request not found" });
          return;
      }
      const deleteEnterprise = Enterprise.findByIdAndDelete(deletedEnterprise.enterprise)

      await EnterpriseRequest.findByIdAndDelete(enterpriseRequestId)
      res.status(200).json({ message: "Enterprise request and associated Enterprise deleted successfully", deleteEnterprise });
  } catch (error: any) {
      res.status(500).json({ message: "Error deleting enterprise request", error: error.message });
  }
};