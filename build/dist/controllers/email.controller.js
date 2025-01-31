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
const oauthController_1 = require("./oauthController");
const emailLogic_1 = require("../helper/emailLogic");
const email_model_1 = __importDefault(require("../models/email.model"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllInboxEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = yield (0, oauthController_1.getAccessToken)();
        const response = yield axios_1.default.get(`https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USERNAME}/mailFolders/Inbox/messages`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const inboxEntries = response.data.value;
        const result = [];
        for (const entry of inboxEntries) {
            const { id, from, subject, receivedDateTime, bodyPreview } = entry;
            const emailRecord = new email_model_1.default({
                id,
                email: from.emailAddress.address,
                subject,
                name: from.emailAddress.name,
                message: bodyPreview,
                sentAt: new Date(receivedDateTime),
                folder: 'Inbox',
            });
            yield emailRecord.save();
            result.push({
                id,
                from: {
                    email: from.emailAddress.address,
                    name: from.emailAddress.name,
                },
                subject,
                receivedDateTime,
                bodyPreview,
            });
        }
        res.status(200).json({ msg: "All inbox successfully fetched", result });
    }
    catch (error) {
        console.error("Error fetching inbox entries:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ message: "Error fetching inbox entries" });
    }
});
exports.getAllInboxEntries = getAllInboxEntries;
const getInboxEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const accessToken = yield (0, oauthController_1.getAccessToken)();
        const response = yield axios_1.default.get(`https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USERNAME}/messages/${id}`, // Endpoint for specific email
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const { from, subject, receivedDateTime, bodyPreview } = response.data;
        res.status(200).json({
            msg: "Inbox successfully fetched",
            id,
            from: from.emailAddress,
            subject,
            receivedDateTime,
            bodyPreview,
        });
    }
    catch (error) {
        console.error("Error fetching inbox entry by ID:", error.message);
        res.status(500).json({ message: "Error fetching inbox entry by ID" });
    }
});
exports.getInboxEntryById = getInboxEntryById;
const getAllSentEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sentEmails = yield email_model_1.default.find().exec();
        if (sentEmails.length === 0) {
            res.status(404).json({ message: "No sent emails found" });
            return;
        }
        res.status(200).json({ msg: "All Sent emails successfully fetched", sentEmails });
    }
    catch (error) {
        console.error("Error fetching sent emails from the database:", error.message);
        res.status(500).json({ message: "Failed to fetch sent emails. Please try again later." });
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
        res.status(200).json({ msg: "Sent emails successfully fetched", email });
    }
    catch (error) {
        console.error("Error fetching email by ID:", error);
        res.status(500).json({ message: "Failed to fetch email" });
    }
});
exports.getSentEmailById = getSentEmailById;
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subject, name, message } = req.body;
        if (![email, subject, message].every((field) => !!field)) {
            res.status(400).json({ message: "All fields (email, subject, message) are required" });
            console.log("Request Body:", req.body);
            return;
        }
        if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
            res.status(400).json({ message: "Invalid data types. Fields must be strings." });
            console.log("Request Body:", req.body);
            return;
        }
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Hello ${name},</h2>
        <p>${message}</p>
        <p>Best regards,<br>LinkOrg NetworksTeam</p>
      </div>
    `;
        yield (0, emailLogic_1.sendEmailWithRetry)(email, subject, htmlContent);
        const emailRecord = new email_model_1.default({ email, subject, name, message, folder: 'Sent', });
        yield emailRecord.save();
        res.status(200).json({ message: "Email sent and logged successfully!", emailRecord });
    }
    catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
});
exports.sendEmail = sendEmail;
