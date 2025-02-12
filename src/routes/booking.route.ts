import express from "express";
import { getAllBookings, getBookingById, newBooking } from "../controllers/booking.controller";
import { validateRequestBody } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/booking/:id", getBookingById);
router.post("/booking", validateRequestBody(["name", "company", "email", "address", "service", "how", "phone", "state", "lga", "specialRequest"]), newBooking);

export default router;
