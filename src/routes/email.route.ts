import express from "express";
import { getAllInboxEntries, getInboxEntryById, getAllSentEmails, getSentEmailById, sendEmail } from "../controllers/email.controller";

const router = express.Router();

router.get("/inbox", getAllInboxEntries); 
router.get("/inbox/:id", getInboxEntryById)
router.post("/send", sendEmail);
router.get("/sent", getAllSentEmails);
router.get("/sent/:id", getSentEmailById);

export default router;
