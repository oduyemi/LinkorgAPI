import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import {
  getRetailRequests,
  getRetailRequestById,
  updateRetailRequestStatus,
  deleteRetailRequest
} from "../controllers/retailRequest.controller";

const router = express.Router();

router.get("/", authenticateAdmin, getRetailRequests);
router.get("/:retailRequestId", authenticateAdmin, getRetailRequestById);
router.put("/:formID/status", authenticateAdmin, updateRetailRequestStatus);
router.delete("/:formID", authenticateAdmin, deleteRetailRequest);

export default router;
