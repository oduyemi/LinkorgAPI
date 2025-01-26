import express from "express";
import { getAllRetailPlans, getRetailPlanById, retailBooking } from "../controllers/retail.controller";

const router = express.Router();

router.get("/", getAllRetailPlans);
router.get("/booking/:id", getRetailPlanById);
router.post("/booking", retailBooking);

export default router;
