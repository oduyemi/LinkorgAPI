import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import {
  getEnquiryRequests,
  getEnquiryRequestById,
  updateEnquiryRequestStatus,
  deleteEnquiryRequest
} from "../controllers/enquiryRequest.controller";

const router = express.Router();

router.get("/", authenticateAdmin, getEnquiryRequests);
router.get("/:enquiryRequestId", authenticateAdmin, getEnquiryRequestById);
router.put("/:enquiryRequestId/status", authenticateAdmin, updateEnquiryRequestStatus);
router.delete("/:enquiryRequestId", authenticateAdmin, deleteEnquiryRequest);

export default router;
