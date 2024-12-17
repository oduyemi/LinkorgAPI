"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.getSentEmailById = exports.getAllSentEmails = exports.getInboxEntryById = exports.getAllInboxEntries = void 0;
const transporter_1 = require("../utils/transporter");
const validator_1 = __importDefault(require("validator"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_model_1 = __importDefault(require("../models/email.model"));
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
dotenv_1.default.config();
const getAllInboxEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inboxEntries = yield inbox_model_1.default.find();
        res.status(200).json(inboxEntries);
    }
    catch (error) {
        console.error("Error fetching inbox entries:", error);
        res.status(500).json({ message: "Error fetching inbox entries" });
    }
});
exports.getAllInboxEntries = getAllInboxEntries;
const getInboxEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const inboxEntry = yield inbox_model_1.default.findById(id);
        if (!inboxEntry) {
            res.status(404).json({ message: "Inbox entry not found" });
            return;
        }
        res.status(200).json(inboxEntry);
    }
    catch (error) {
        console.error("Error fetching inbox entry:", error);
        res.status(500).json({ message: "Error fetching inbox entry" });
    }
});
exports.getInboxEntryById = getInboxEntryById;
const getAllSentEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emails = yield email_model_1.default.find().sort({ sentAt: -1 });
        res.status(200).json(emails);
    }
    catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ message: "Failed to fetch emails" });
    }
});
exports.getAllSentEmails = getAllSentEmails;
const getSentEmailById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const email = yield email_model_1.default.findById(id);
        if (!email) {
            res.status(404).json({ message: "Email not found" });
            return;
        }
        res.status(200).json(email);
    }
    catch (error) {
        console.error("Error fetching email by ID:", error);
        res.status(500).json({ message: "Failed to fetch email" });
    }
});
exports.getSentEmailById = getSentEmailById;
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subject, name = "LinkOrg Networks LTD", message } = req.body;
        if (![email, subject, name, message].every(field => field)) {
            res.status(400).json({ message: "All fields (email, subject, name, message) are required" });
            return;
        }
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        }
        if (message.trim().length === 0) {
            res.status(400).json({ message: "Message cannot be empty" });
            return;
        }
        if (!process.env.SMTP_USERNAME || !process.env.SMTP_PWD) {
            res.status(500).json({ message: "SMTP credentials are not set correctly" });
            return;
        }
        const mailOptions = {
            from: `"LinkOrg Admin" <${process.env.SMTP_USERNAME}>`,
            to: email,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <p>${message}</p>
                    <p>Best regards,<br>LinkOrg Team</p>
                </div>
            `,
        };
        yield transporter_1.transporter.sendMail(mailOptions);
        const newEmail = new email_model_1.default({
            email,
            subject,
            name,
            message,
            sentAt: new Date(),
        });
        yield newEmail.save();
        res.status(200).json({ message: "Email sent and saved successfully!" });
    }
    catch (error) {
        console.error("Error sending email:", error.stack || error);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
});
exports.sendEmail = sendEmail;
