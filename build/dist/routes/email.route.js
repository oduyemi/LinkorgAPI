"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const email_controller_1 = require("../controllers/email.controller");
const router = express_1.default.Router();
router.get("/inbox", email_controller_1.getAllInboxEntries);
router.get("/inbox/:id", email_controller_1.getInboxEntryById);
router.post("/send", email_controller_1.sendEmail);
router.get("/sent", email_controller_1.getAllSentEmails);
router.get("/sent/:id", email_controller_1.getSentEmailById);
exports.default = router;
