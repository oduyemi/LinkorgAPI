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
exports.newContact = exports.getContactById = exports.getAllContacts = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
const email_1 = require("../utils/email");
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find();
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
});
exports.getAllContacts = getAllContacts;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const contact = yield contact_model_1.default.findById(id);
        if (!contact) {
            res.status(404).json({ message: "Contact data not found" });
            return;
        }
        res.status(200).json(contact);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
});
exports.getContactById = getContactById;
const newContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (![name, email, phone, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newContactEntry = new contact_model_1.default({ name, email, phone, subject, message });
        yield newContactEntry.save();
        const newInboxEntry = new inbox_model_1.default({
            formType: "Contact",
            senderName: name,
            senderEmail: email,
            subject,
            message,
        });
        yield newInboxEntry.save();
        // Email Notification
        const mailOptions = {
            from: `"LinkOrg Contact Form" <${process.env.SMTP_USERNAME}>`,
            to: "nok@linkorgnet.com",
            cc: "hello@linkorgnet.com",
            subject: `New Contact Form Submission${subject ? `: ${subject}` : ""}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
                    <p>A new contact form has been submitted with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="font-weight: bold;">Name:</td><td>${name}</td></tr>
                        <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                        <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                        ${subject ? `<tr><td style="font-weight: bold;">Subject:</td><td>${subject}</td></tr>` : ""}
                        <tr><td style="font-weight: bold;">Message:</td><td>${message}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
                </div>
            `,
        };
        yield (0, email_1.sendEmail)(mailOptions);
        res.status(201).json({ message: "New contact form added successfully, and email sent." });
    }
    catch (error) {
        console.error("Error during contact data creation or email sending:", error);
        res.status(500).json({ message: "Error creating contact data or sending email" });
    }
});
exports.newContact = newContact;
