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
exports.newEnquiry = exports.getEnquiryById = exports.getAllEnquiries = void 0;
const enquiry_model_1 = __importDefault(require("../models/enquiry.model"));
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
const enquiryMail_1 = require("../helper/enquiryMail");
const emailLogic_1 = require("../helper/emailLogic");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enquiries = yield enquiry_model_1.default.find();
        res.status(200).json(enquiries);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving enquiries", error: error.message });
    }
});
exports.getAllEnquiries = getAllEnquiries;
const getEnquiryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const enquiry = yield enquiry_model_1.default.findById(id);
        if (!enquiry) {
            res.status(404).json({ message: "Enquiry not found" });
            return;
        }
        res.status(200).json(enquiry);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving enquiry", error: error.message });
    }
});
exports.getEnquiryById = getEnquiryById;
const newEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, company, address, phone, state, topic, message } = req.body;
        const name = fname + " " + lname;
        if (![fname, lname, email, company, address, phone, state, topic, message].every(Boolean)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newEnquiryEntry = new enquiry_model_1.default({ fname, lname, email, company, address, phone, state, topic, message });
        yield newEnquiryEntry.save();
        const newInboxEntry = new inbox_model_1.default({
            formType: "Enquiry",
            senderName: `${fname} ${lname}`,
            senderEmail: email,
            subject: topic,
            message,
        });
        yield newInboxEntry.save();
        yield (0, enquiryMail_1.enquiryMail)(email, name);
        const subject = `New Enquiry Received${topic ? `: ${topic}` : ""}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Enquiry Form Submission</h2>
                <p>A new enquiry form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">First Name:</td><td>${fname}</td></tr>
                    <tr><td style="font-weight: bold;">Last Name:</td><td>${lname}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                    <tr><td style="font-weight: bold;">State:</td><td>${state}</td></tr>
                    <tr><td style="font-weight: bold;">Topic:</td><td>${topic}</td></tr>
                    <tr><td style="font-weight: bold;">Message:</td><td>${message}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
            </div>`;
        // Send email to both addresses
        const recipients = ["hello@linkorgnet.com", "noc@linkorgnet.com"];
        yield Promise.all(recipients.map((recipient) => (0, emailLogic_1.sendEmailWithRetry)(recipient, subject, htmlContent, 3)));
        res.status(201).json({ message: "New enquiry form added successfully, and email sent.", newEnquiryEntry });
    }
    catch (error) {
        console.error("Error during enquiry data creation or email sending:", error);
        res.status(500).json({ message: "Error creating enquiry data or sending email" });
    }
});
exports.newEnquiry = newEnquiry;
