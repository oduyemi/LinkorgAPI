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
router.put("/:formID/status", authenticateAdmin, updateEnquiryRequestStatus);
router.delete("/:formID", authenticateAdmin, deleteEnquiryRequest);

export default router;
