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
router.put("/:contactRequestId/status", authenticateAdmin, updateContactRequestStatus);
router.delete("/:contactRequestId", authenticateAdmin, deleteContactRequest);

export default router;


