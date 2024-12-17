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
exports.newBooking = exports.getBookingById = exports.getAllBookings = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const email_1 = require("../utils/email");
const inbox_model_1 = __importDefault(require("../models/inbox.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield booking_model_1.default.find();
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving booking data", error: error.message });
    }
});
exports.getAllBookings = getAllBookings;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const booking = yield booking_model_1.default.findById(id);
        if (!booking) {
            res.status(404).json({ message: "Booking data not found" });
            return;
        }
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving booking data", error: error.message });
    }
});
exports.getBookingById = getBookingById;
const newBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, company, email, address, service, how, phone, state, lga, specialRequest } = req.body;
        if (![name, company, email, address, service, how, phone, state, lga, specialRequest].every(Boolean)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const addBooking = new booking_model_1.default({ name, company, email, address, service, how, phone, state, lga, specialRequest });
        yield addBooking.save();
        const newInboxEntry = new inbox_model_1.default({
            formType: "Booking",
            senderName: name,
            senderEmail: email,
            message: `Service: ${service}, Special Request: ${specialRequest}`,
        });
        yield newInboxEntry.save();
        const mailOptions = {
            from: `"LinkOrg Bookings" <${process.env.SMTP_USERNAME}>`,
            to: "nok@linkorgnet.com",
            cc: "hello@linkorgnet.com",
            subject: "New Booking Form Submission",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">New Booking Form Submission</h2>
                    <p>A new booking form has been submitted with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="font-weight: bold;">Name:</td><td>${name}</td></tr>
                        <tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>
                        <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                        <tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>
                        <tr><td style="font-weight: bold;">Address:</td><td>${address}</td></tr>
                        <tr><td style="font-weight: bold;">State:</td><td>${state}</td></tr>
                        <tr><td style="font-weight: bold;">LGA:</td><td>${lga}</td></tr>
                        <tr><td style="font-weight: bold;">Service:</td><td>${service}</td></tr>
                        <tr><td style="font-weight: bold;">How:</td><td>${how}</td></tr>
                        <tr><td style="font-weight: bold;">Special Request:</td><td>${specialRequest}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Best regards,<br>LinkOrg Networks</p>
                </div>
            `,
        };
        yield (0, email_1.sendEmail)(mailOptions);
        res.status(201).json({ message: "New booking form added successfully, and email sent." });
    }
    catch (error) {
        console.error("Error during booking creation or email sending:", error);
        res.status(500).json({ message: "Error creating booking or sending email" });
    }
});
exports.newBooking = newBooking;
