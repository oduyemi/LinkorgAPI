import express from "express";
import { enterpriseBooking, getAllEnteprisePlans, getEnterprisePlanById,   } from "../controllers/enterprise.controller";

const router = express.Router();

router.get("/", getAllEnteprisePlans);
router.get("/:id", getEnterprisePlanById);
router.post("/", enterpriseBooking);

export default router;
