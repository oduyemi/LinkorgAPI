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
exports.enterpriseBooking = exports.getEnterprisePlanById = exports.getAllEnteprisePlans = void 0;
const enterprise_model_1 = __importDefault(require("../models/enterprise.model"));
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
const bookingMail_1 = require("../helper/bookingMail");
const dotenv_1 = __importDefault(require("dotenv"));
const emailLogic_1 = require("../helper/emailLogic");
dotenv_1.default.config();
const getAllEnteprisePlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entPlans = yield enterprise_model_1.default.find();
        res.status(200).json(entPlans);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving internet enterprisr plan data", error: error.message });
    }
});
exports.getAllEnteprisePlans = getAllEnteprisePlans;
const getEnterprisePlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const entplan = yield enterprise_model_1.default.findById(id);
        if (!entplan) {
            res.status(404).json({ message: "Internet enterprise plan data not found" });
            return;
        }
        res.status(200).json(entplan);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving internet enterprise plan data", error: error.message });
    }
});
exports.getEnterprisePlanById = getEnterprisePlanById;
const enterpriseBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, company, email, phone, contact, contact_job, address, plan, how, note, } = req.body;
        if (![fullname, company, email, phone, contact, contact_job, address, plan, how].every(Boolean)) {
            res.status(400).json({ message: "All required fields must be filled" });
            return;
        }
        const addEnterpriseBooking = new enterprise_model_1.default({
            fullname,
            company,
            email,
            phone,
            contact,
            contact_job,
            address,
            plan,
            how,
            note,
        });
        yield addEnterpriseBooking.save();
        const newInboxEntry = new inbox_model_1.default({
            formType: "Booking",
            senderName: fullname,
            senderEmail: email,
            message: `Internet Plan: ${plan}, Additional Note: ${note}`,
        });
        yield newInboxEntry.save();
        // Send booking confirmation email
        yield (0, bookingMail_1.bookingMail)(email, fullname);
        // Email content
        const subject = "New Booking For Enterprise Internet Plan Booking";
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Booking For Enterprise Internet Plan</h2>
                <p>A new booking form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${fullname}</td></tr>
                    <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                    <tr><td style="font-weight: bold;">Plan:</td><td>${plan}</td></tr>
                    <tr><td style="font-weight: bold;">Contact Person:</td><td>${contact}</td></tr>
                    <tr><td style="font-weight: bold;">Job Title:</td><td>${contact_job}</td></tr>
                    <tr><td style="font-weight: bold;">How did you hear about us?:</td><td>${how}</td></tr>
                    <tr><td style="font-weight: bold;">Additional Note:</td><td>${note}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
            </div>
        `;
        const recipients = ["hello@linkorgnet.com", "noc@linkorgnet.com"];
        yield Promise.all(recipients.map((recipient) => (0, emailLogic_1.sendEmailWithRetry)(recipient, subject, htmlContent, 3)));
        res.status(201).json({ message: "New Booking request made successfully, and email sent.", addEnterpriseBooking });
    }
    catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({
            message: "Error creating booking or sending email",
        });
    }
});
exports.enterpriseBooking = enterpriseBooking;
