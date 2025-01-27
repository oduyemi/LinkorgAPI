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
exports.retailBooking = exports.getRetailPlanById = exports.getAllRetailPlans = void 0;
const retail_model_1 = __importDefault(require("../models/retail.model"));
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
const bookingMail_1 = require("../helper/bookingMail");
const dotenv_1 = __importDefault(require("dotenv"));
const emailSample_1 = require("../helper/emailSample");
dotenv_1.default.config();
const getAllRetailPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const retailPlans = yield retail_model_1.default.find();
        res.status(200).json(retailPlans);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving internet retail plan data", error: error.message });
    }
});
exports.getAllRetailPlans = getAllRetailPlans;
const getRetailPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const retailplan = yield retail_model_1.default.findById(id);
        if (!retailplan) {
            res.status(404).json({ message: "Internet retail plan data not found" });
            return;
        }
        res.status(200).json(retailplan);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving internet retail plan data", error: error.message });
    }
});
exports.getRetailPlanById = getRetailPlanById;
const retailBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, company, email, phone, address, plan, price, installation, how, note, } = req.body;
        if (![fullname, email, phone, address, plan, price, installation, how].every(Boolean)) {
            res.status(400).json({ message: "All required fields must be filled" });
            return;
        }
        const taxRate = 0.075;
        const totalAmount = (price + installation) * (1 + taxRate);
        const addRetailBooking = new retail_model_1.default({
            fullname,
            company,
            email,
            phone,
            address,
            plan,
            price,
            installation,
            how,
            note,
            totalAmount,
        });
        yield addRetailBooking.save();
        const newInboxEntry = new inbox_model_1.default({
            formType: "Booking",
            senderName: fullname,
            senderEmail: email,
            message: `Service: ${plan}, Additional Note: ${note}, Total Amount: ${totalAmount}`,
        });
        yield newInboxEntry.save();
        yield (0, bookingMail_1.bookingMail)(email);
        const subject = "New Booking For Retail/SME Internet Plan Booking";
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">New Booking For Retail/SME Internet Plan Booking</h2>
                <p>A new booking form has been submitted with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${fullname}</td></tr>
                    <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                    <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                    <tr><td style="font-weight: bold;">State:</td><td>${plan}</td></tr>
                    <tr><td style="font-weight: bold;">LGA:</td><td>${price}</td></tr>
                    <tr><td style="font-weight: bold;">Service:</td><td>${installation}</td></tr>
                    <tr><td style="font-weight: bold;">How did you hear about us?:</td><td>${how}</td></tr>
                    <tr><td style="font-weight: bold;">Additional Note:</td><td>${note}</td></tr>
                    <tr><td style="font-weight: bold;">Total Amount:</td><td>${totalAmount.toFixed(2)}</td></tr>
                </table>
                <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
            </div>
        `;
        yield (0, emailSample_1.sendEmailWithRetry)("noc@linkorgnet.com", subject, htmlContent, 3);
        res.status(201).json({
            message: "New booking form added successfully, and email sent.",
            newInboxEntry,
        });
    }
    catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({
            message: "Error creating booking or sending email",
        });
    }
});
exports.retailBooking = retailBooking;
