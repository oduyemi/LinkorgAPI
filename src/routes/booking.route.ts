import express from "express";
import { getAllBookings, getBookingById, newBooking, updateBookingStatus } from "../controllers/booking.controller";
import { validateRequestBody } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/booking/:id", getBookingById);
router.put("/update-booking/:id", updateBookingStatus);
router.post("/booking", validateRequestBody(["name", "company", "email", "address", "service", "how", "phone", "state", "lga", "specialRequest"]), newBooking);

export default router;
