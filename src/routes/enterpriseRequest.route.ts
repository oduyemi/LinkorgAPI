import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import {
  getEnterpriseRequests,
  getEnterpriseRequestById,
  updateEnterpriseRequestStatus,
  deleteEnterpriseRequest
} from "../controllers/enterpriseRequest.controller";

const router = express.Router();

router.get("/", authenticateAdmin, getEnterpriseRequests);
router.get("/:enterpriseRequestId", authenticateAdmin, getEnterpriseRequestById);
router.put("/:enterpriseRequestId/status", authenticateAdmin, updateEnterpriseRequestStatus);
router.delete("/:enterpriseRequestId", authenticateAdmin, deleteEnterpriseRequest);

export default router;
