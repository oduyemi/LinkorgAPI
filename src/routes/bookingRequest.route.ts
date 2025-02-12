import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import {
  getBookingRequests,
  getBookingRequestById,
  updateBookingRequestStatus,
  deleteBookingRequest
} from "../controllers/bookingRequest.controller";

const router = express.Router();

router.get("/", authenticateAdmin, getBookingRequests);
router.get("/:bookingRequestId", authenticateAdmin, getBookingRequestById);
router.put('/:formID/status', authenticateAdmin, updateBookingRequestStatus);
router.delete("/:formID", authenticateAdmin, deleteBookingRequest);


export default router;
