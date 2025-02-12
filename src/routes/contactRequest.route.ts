import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import {
  getContactRequests,
  getContactRequestById,
  updateContactRequestStatus,
  deleteContactRequest
} from "../controllers/contactRequest.controller";

const router = express.Router();

router.get("/", authenticateAdmin, getContactRequests);
router.get("/:contactRequestId", authenticateAdmin, getContactRequestById);
router.put("/:formID/status", authenticateAdmin, updateContactRequestStatus);
router.delete("/:formID", authenticateAdmin, deleteContactRequest);

export default router;


