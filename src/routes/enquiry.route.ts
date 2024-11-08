import express from "express";
import { getAllEnquiries, getEnquiryById, newEnquiry } from "../controllers/enquiry.controller";
import { validateRequestBody } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/enquiries", getAllEnquiries);
router.get("/enquiry/:id", getEnquiryById);
router.post("/enquiry", validateRequestBody(["fname", "lname", "email", "company", "address", "phone", "state", "topic", "message"]), newEnquiry);


export default router;
