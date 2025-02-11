import express from "express";
import { getAllRetailPlans, getRetailPlanById, retailBooking } from "../controllers/retail.controller";

const router = express.Router();

router.get("/", getAllRetailPlans);
router.get("/:id", getRetailPlanById);
router.post("/", retailBooking);

export default router;
