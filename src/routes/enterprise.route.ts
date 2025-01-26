import express from "express";
import { enterpriseBooking, getAllEnteprisePlans, getEnterprisePlanById,   } from "../controllers/enterprise.controller";

const router = express.Router();

router.get("/", getAllEnteprisePlans);
router.get("/booking/:id", getEnterprisePlanById);
router.post("/booking", enterpriseBooking);

export default router;
