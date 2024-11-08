import express from "express";
import { getAllContacts, getContactById, newContact } from "../controllers/contact.controller";
import { validateRequestBody } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/contact/:id", getContactById);
router.post("/contact", validateRequestBody(["name", "email", "phone", "subject", "message"]), newContact);




export default router;
