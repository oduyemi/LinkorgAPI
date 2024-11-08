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
        if (![name, company, email, address, service, how, phone, state, lga, specialRequest].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const addBooking = new booking_model_1.default({ name, company, email, address, service, how, phone, state, lga, specialRequest });
        yield addBooking.save();
        res.status(201).json({ message: "New booking form added successfully" });
    }
    catch (error) {
        console.error("Error during booking data creation:", error);
        res.status(500).json({ message: "Error creating booking data" });
    }
});
exports.newBooking = newBooking;
