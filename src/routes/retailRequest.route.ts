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
router.put("/:retailRequestId/status", authenticateAdmin, updateRetailRequestStatus);
router.delete("/:retailRequestId", authenticateAdmin, deleteRetailRequest);

export default router;
